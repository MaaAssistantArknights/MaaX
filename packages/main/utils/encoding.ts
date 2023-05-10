import iconv from 'iconv-lite'

export const utf8Encode = (str: string): Buffer => iconv.encode(str, 'utf8')
export const gb2312Encode = (str: string): Buffer => iconv.encode(str, 'gb2312')

export const utf8Decode = (buf: Buffer): string => iconv.decode(buf, 'utf8')
export const gb2312Decode = (buf: Buffer): string => iconv.decode(buf, 'gb2312')

export const utf8ToGb2312 = (str: string): string => gb2312Decode(utf8Encode(str))
export const gb2312ToUtf8 = (str: string): string => utf8Decode(gb2312Encode(str))
