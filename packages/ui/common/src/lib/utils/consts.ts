import { FlowTemplate } from '@activepieces/shared';

export const unexpectedErrorMessage = $localize`An unexpected error occured, please contact support`;
export const codeGeneratorTooltip = $localize`Write code with assistance from AI`;
export const disabledCodeGeneratorTooltip = $localize`Configure api key in the envrionment variables to generate code using AI`;

export const flowActionsUiInfo = {
  duplicate: {
    text: $localize`Duplicate`,
    icon: 'assets/img/custom/duplicate.svg',
  },
  import: {
    text: $localize`Import`,
    icon: 'assets/img/custom/import.svg',
  },
  export: {
    text: $localize`Export`,
    icon: 'assets/img/custom/download.svg',
  },
  delete: {
    text: $localize`Delete`,
    icon: 'assets/img/custom/trash.svg',
    note: $localize`This will permanently delete the flow, all its data and any background runs.
    You can't undo this action.`,
  },
  rename: {
    text: $localize`Rename`,
    icon: 'assets/img/custom/pencil-underline.svg',
  },
  share: {
    text: $localize`Share`,
    icon: 'assets/img/custom/share.svg',
  },
  move: {
    text: $localize`Move to...`,
    icon: 'assets/img/custom/move.svg',
  },
  pushToGit: {
    text: $localize`Push to Git`,
    icon: 'assets/img/custom/upload.svg',
  },
  iconSizeTailWind: 'ap-w-[20px] ap-h-[20px]',
};

export const downloadJson = (obj: any, fileName: string) => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadFlow = (flow: FlowTemplate) => {
  downloadJson(flow, flow.name);
};

export const jsonEditorOptionsMonaco = {
  minimap: { enabled: false },
  theme: 'apTheme',
  language: 'json',
  readOnly: true,
  automaticLayout: true,
};
