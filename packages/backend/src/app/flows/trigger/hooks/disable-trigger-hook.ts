import { FlowVersion, PieceTrigger, ProjectId, TriggerHookType, TriggerType } from '@activepieces/shared'
import { EngineHelperResponse, EngineHelperTriggerResult, engineHelper } from '../../../helper/engine-helper'
import { getPieceTrigger } from './trigger-utils'
import { webhookService } from '../../../webhooks/webhook-service'
import { TriggerBase, TriggerStrategy, WebhookRenewStrategy } from '@activepieces/pieces-framework'
import { appEventRoutingService } from '../../../app-event-routing/app-event-routing.service'
import { flowQueue } from '../../../workers/flow-worker/flow-queue'
import { captureException } from '@sentry/node'

export const disablePieceTrigger = async (params: DisableParams): Promise<EngineHelperResponse<
EngineHelperTriggerResult<TriggerHookType.ON_DISABLE>
> | null> => {
    const { flowVersion, projectId, simulate } = params
    if (flowVersion.trigger.type !== TriggerType.PIECE) {
        return null
    }
    const flowTrigger = flowVersion.trigger as PieceTrigger
    const pieceTrigger = await getPieceTrigger({
        trigger: flowTrigger,
        projectId,
    })

    try {
        return await engineHelper.executeTrigger({
            hookType: TriggerHookType.ON_DISABLE,
            flowVersion,
            webhookUrl: await webhookService.getWebhookUrl({
                flowId: flowVersion.flowId,
                simulate,
            }),
            projectId,
        })
    }
    catch (error) {
        captureException(error)
        if (!params.ignoreError) {
            throw error
        }
        return null
    }
    finally {
        await sideeffect(pieceTrigger, projectId, flowVersion)
    }

}

async function sideeffect(pieceTrigger: TriggerBase, projectId: string, flowVersion: FlowVersion): Promise<void> {
    switch (pieceTrigger.type) {
        case TriggerStrategy.APP_WEBHOOK:
            await appEventRoutingService.deleteListeners({
                projectId,
                flowId: flowVersion.flowId,
            })
            break
        case TriggerStrategy.WEBHOOK: {
            const renewConfiguration = pieceTrigger.renewConfiguration
            if (renewConfiguration?.strategy === WebhookRenewStrategy.CRON) {
                await flowQueue.removeRepeatingJob({
                    id: flowVersion.id,
                })
            }
            break
        }
        case TriggerStrategy.POLLING:
            await flowQueue.removeRepeatingJob({
                id: flowVersion.id,
            })
            break
    }
}
type DisableParams = {
    projectId: ProjectId
    flowVersion: FlowVersion
    simulate: boolean
    ignoreError?: boolean
}