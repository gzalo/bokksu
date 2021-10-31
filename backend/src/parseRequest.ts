import { parseMultipart } from '@ssttevee/multipart-parser';

const RE_MULTIPART = /^multipart\/form-data(?:;\s*boundary=(?:"((?:[^"]|\\")+)"|([^\s;]+)))$/;

const getBoundary = (request: Request): string | undefined => {
  const contentType = request.headers.get('Content-Type');
  if (!contentType) return;

  const matches = RE_MULTIPART.exec(contentType);
  if (!matches) return;

  return matches[1] || matches[2];
};

type RequestData = {
  files: File[];
  fileNames: string[];
  fileTypes: string[];
  others: string[];
  otherNames: string[];
};

export const parseRequest = async (request: Request): Promise<RequestData | undefined> => {
  const boundary = getBoundary(request);
  if (!boundary || !request.body) return;

  const parts = await parseMultipart(request.body, boundary);

  const out: RequestData = {
    files: [],
    fileNames: [],
    fileTypes: [],
    others: [],
    otherNames: [],
  };

  for (const { name, data, filename, contentType } of parts) {
    if (filename) {
      out.files.push(new File([data], filename, { type: contentType }));
      out.fileNames.push(name);
      out.fileTypes.push(contentType || '');
    } else {
      out.others.push(new TextDecoder().decode(data));
      out.otherNames.push(name);
    }
  }

  return out;
};
