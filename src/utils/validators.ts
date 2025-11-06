/**
 * Validator - 純靜態表單欄位驗證工具類。
 * 提供常用驗證方法，例如 required（必填）、email（電子郵件格式）、minLength（最小長度）、pattern（正則模式）、custom（自訂驗證）。
 * 包含安全性驗證，防止惡意輸入和注入攻擊。
 */
import { type TValidationValue } from '~/types/validation';

export class Validator {
  /**
   * 檢查值是否不為空（必填欄位驗證）。
   * @param value - 欲驗證的值
   * @returns {boolean} 若值不為空則回傳 true，否則回傳 false
   */
  static required(value: TValidationValue): boolean {
    return !(
      value === null ||
      value === undefined ||
      value.toString().trim() === '' ||
      (Array.isArray(value) && value.length === 0)
    );
  }

  /**
   * 驗證值是否為合法的電子郵件地址。
   * @param value - 欲驗證的值
   * @returns {boolean} 若值為合法 email 則回傳 true，否則回傳 false
   */
  static email(value: unknown): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  }

  /**
   * 驗證字串值是否符合最小長度限制。
   * @param value - 欲驗證的值
   * @param min - 最小長度
   * @returns {boolean} 若值長度 >= min 則回傳 true，否則回傳 false
   */
  static minLength(value: unknown, min: number): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    return value.length >= min;
  }

  /**
   * 驗證字串值是否符合指定的正則表達式模式。
   * @param value - 欲驗證的值
   * @param regex - 欲測試的正則表達式
   * @returns {boolean} 若值符合模式則回傳 true，否則回傳 false
   */
  static pattern(value: unknown, regex: RegExp): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    return regex.test(value);
  }

  /**
   * 驗證字串值是否符合最大長度限制。
   * @param value - 欲驗證的值
   * @param max - 最大長度
   * @returns {boolean} 若值長度 <= max 則回傳 true，否則回傳 false
   */
  static maxLength(value: unknown, max: number): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    return value.length <= max;
  }

  /**
   * 檢查輸入是否包含潛在的 XSS 攻擊向量
   * @param value - 欲驗證的值
   * @returns {boolean} 若值安全則回傳 true，否則回傳 false
   */
  static noXSS(value: unknown): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    // 檢查常見的 XSS 攻擊模式
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^>]*>/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
    ];

    return !xssPatterns.some(pattern => pattern.test(value));
  }

  /**
   * 檢查輸入是否包含潛在的 SQL 注入攻擊向量
   * @param value - 欲驗證的值
   * @returns {boolean} 若值安全則回傳 true，否則回傳 false
   */
  static noSQLInjection(value: unknown): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    const sqlPatterns = [
      // 1. 引號內的 SQL 關鍵字注入
      /('.*?(or|and|union|select|insert|update|delete|drop).*?')/gi,

      // 2. 引號內包含分號的攻擊
      /('.*?;.*?')/gi,

      // 3. 堆疊查詢攻擊 (分號後跟 SQL 命令)
      /;\s*(select|insert|update|delete|drop|create|alter|exec|union)/gi,

      // 4. 聯合注入攻擊
      /union\s+(all\s+)?select\s+.*(from|null|char|concat|\d+)/gi,

      // 5. 條件繞過攻擊
      /('.*?=.*?'.*?(or|and))|(\d+\s*=\s*\d+\s*(or|and))/gi,

      // 6. SQL 註解後跟命令
      /(--|\/\*|\*\/|#)\s*(select|insert|update|delete|drop|union|exec)/gi,

      // 7. 危險的存儲過程和函數調用
      /(exec|execute|sp_|xp_)\s*\(/gi,

      // 8. 時間延遲攻擊
      /(waitfor|delay|sleep|benchmark)\s*\(/gi,

      // 9. 錯誤注入攻擊
      /(cast|convert|extractvalue|updatexml)\s*\(/gi,

      // 10. 經典的 OR/AND 注入模式
      /('\s*(or|and)\s*'?\s*=\s*'?)|(\s+(or|and)\s+'?\d+\s*=\s*\d+)/gi,
    ];

    return !sqlPatterns.some(pattern => pattern.test(value));
  }

  /**
   * 驗證 URL 格式和安全性
   * @param value - 欲驗證的值
   * @returns {boolean} 若值為安全的 URL 則回傳 true，否則回傳 false
   */
  static safeUrl(value: unknown): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    try {
      const url = new URL(value);

      // 只允許 http 和 https 協議
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(url.protocol)) {
        return false;
      }

      // 檢查是否為本地地址（可選，根據需求調整）
      const hostname = url.hostname.toLowerCase();
      const localPatterns = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];

      // 如果是本地地址，在生產環境中可能需要拒絕
      if (process.env.NODE_ENV === 'production') {
        if (localPatterns.some(pattern => hostname.includes(pattern))) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * 驗證檔案名稱安全性
   * @param value - 欲驗證的檔案名稱
   * @returns {boolean} 若檔案名稱安全則回傳 true，否則回傳 false
   */
  static safeFilename(value: unknown): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    // 檢查危險的檔案名稱模式
    const dangerousPatterns = [
      /\.\./g, // 路徑遍歷
      /[<>:"|?*]/g, // Windows 不允許的字符
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows 保留名稱
      /^\./g, // 隱藏檔案
      /\.(exe|bat|cmd|scr|pif|com|vbs|js|jar|app|deb|rpm)$/i, // 可執行檔案
    ];

    return !dangerousPatterns.some(pattern => pattern.test(value));
  }

  /**
   * 驗證數字範圍
   * @param value - 欲驗證的值
   * @param min - 最小值
   * @param max - 最大值
   * @returns {boolean} 若值在範圍內則回傳 true，否則回傳 false
   */
  static numberRange(value: unknown, min: number, max: number): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    const num = Number(value);
    if (isNaN(num)) {
      return false;
    }

    return num >= min && num <= max;
  }

  /**
   * 驗證電話號碼格式（台灣）
   * @param value - 欲驗證的值
   * @returns {boolean} 若值為有效的電話號碼則回傳 true，否則回傳 false
   */
  static phoneNumber(value: unknown): boolean {
    if (!value || typeof value !== 'string') {
      return true;
    }

    // 台灣電話號碼格式
    const phoneRegex = /^(\+886|886|0)?[2-9]\d{7,8}$/;
    const mobileRegex = /^(\+886|886|0)?9\d{8}$/;

    const cleanValue = value.replace(/[\s\-()]/g, '');
    return phoneRegex.test(cleanValue) || mobileRegex.test(cleanValue);
  }

  /**
   * 清理和淨化輸入字串
   * @param value - 欲清理的值
   * @returns {string} 清理後的字串
   */
  static sanitizeString(value: unknown): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    return value
      .trim()
      .replace(/[<>]/g, '') // 移除 < 和 >
      .replace(/javascript:/gi, '') // 移除 javascript: 協議
      .replace(/on\w+\s*=/gi, '') // 移除事件處理器
      .substring(0, 1000); // 限制長度
  }
}
