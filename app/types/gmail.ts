export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailMessagePart {
  mimeType: string;
  headers: GmailHeader[];
  body: {
    data?: string;
  };
  parts?: GmailMessagePart[];
}

export interface GmailMessage {
  id: string;
  threadId: string;
  payload: {
    headers: GmailHeader[];
    body: {
      data?: string;
    };
    parts?: GmailMessagePart[];
  };
}

export interface GmailClient {
  users: {
    messages: {
      list: (params: {
        userId: string;
        q?: string;
        maxResults?: number;
      }) => Promise<{
        data: {
          messages?: { id: string; threadId: string }[];
        };
      }>;
      get: (params: {
        userId: string;
        id: string;
        format: string;
      }) => Promise<{
        data: GmailMessage;
      }>;
    };
  };
} 
