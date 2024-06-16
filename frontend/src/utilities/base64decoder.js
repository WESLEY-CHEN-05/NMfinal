function base64UrlDecode(input) {
  // 将Base64Url编码转换为Base64编码
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  // 对于不是4的倍数的字符串长度，添加等号（=）进行填充
  const padLength = 4 - (base64.length % 4);
  base64 += '='.repeat(padLength > 0 && padLength < 4 ? padLength : 0);
  // Base64解码并转换为字符串
  const bytes = atob(base64);
  try {
    // 尝试解析JSON
    return JSON.parse(bytes);
  } catch (e) {
    // 如果不是JSON格式，直接返回解码后的字符串
    return bytes;
  }
}


export default function base64decoder(jwt) {
  const parts = jwt.split('.');
  const header = parts[0];
  const payload = parts[1];
  const signature = parts[2];
  const decodedHeader = base64UrlDecode(header);
  const decodedPayload = base64UrlDecode(payload);
  return decodedPayload;
}
