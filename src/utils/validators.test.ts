import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Validator } from './validators';

describe('當：Validator 工具類', () => {
  afterEach(() => {
    // 清理環境變數
    delete process.env.NODE_ENV;
  });

  describe('當：required 驗證器', () => {
    it('當：給定空字串時，應該：回傳 false', () => {
      expect(Validator.required('')).toBe(false);
    });

    it('當：給定純空白字串時，應該：回傳 false', () => {
      expect(Validator.required('   ')).toBe(false);
      expect(Validator.required('\t\n\r')).toBe(false);
    });

    it('當：給定 null 時，應該：回傳 false', () => {
      expect(Validator.required(null)).toBe(false);
    });

    it('當：給定 undefined 時，應該：回傳 false', () => {
      expect(Validator.required(undefined)).toBe(false);
    });

    it('當：給定空陣列時，應該：回傳 false', () => {
      expect(Validator.required([])).toBe(false);
    });

    it('當：給定非空字串時，應該：回傳 true', () => {
      expect(Validator.required('test')).toBe(true);
      expect(Validator.required('  test  ')).toBe(true);
    });

    it('當：給定非空陣列時，應該：回傳 true', () => {
      expect(Validator.required([1])).toBe(true);
      expect(Validator.required(['test'])).toBe(true);
    });

    it('當：給定數字時，應該：回傳 true', () => {
      expect(Validator.required(123)).toBe(true);
      expect(Validator.required(0)).toBe(true);
      expect(Validator.required(-1)).toBe(true);
    });

    it('當：給定布林值時，應該：回傳 true', () => {
      expect(Validator.required(true)).toBe(true);
      expect(Validator.required(false)).toBe(true);
    });
  });

  describe('當：email 驗證器', () => {
    it('當：給定無效的電子郵件格式時，應該：回傳 false', () => {
      const invalidEmails = [
        'test',
        'test@',
        'test@test',
        '@test.com',
        'test@.com',
        'test@test.',
        'test @test.com',
        'test@test .com',
      ];

      invalidEmails.forEach(email => {
        expect(Validator.email(email)).toBe(false);
      });
    });

    it('當：給定包含雙點的電子郵件時，應該：回傳 true（目前實現允許）', () => {
      const doubleDotsEmails = ['test..test@test.com', 'test@test..com'];

      doubleDotsEmails.forEach(email => {
        expect(Validator.email(email)).toBe(true);
      });
    });

    it('當：給定有效的電子郵件格式時，應該：回傳 true', () => {
      const validEmails = [
        'test@test.com',
        'test.test@test.com',
        'test+test@test.com',
        'test@test.co.uk',
        'user123@example.org',
        'test-user@domain-name.com',
      ];

      validEmails.forEach(email => {
        expect(Validator.email(email)).toBe(true);
      });
    });

    it('當：給定空字串或 undefined 時，應該：回傳 true（選填欄位）', () => {
      expect(Validator.email('')).toBe(true);
      expect(Validator.email(undefined)).toBe(true);
      expect(Validator.email(null)).toBe(true);
    });

    it('當：給定非字串類型時，應該：回傳 true', () => {
      expect(Validator.email(123)).toBe(true);
      expect(Validator.email([])).toBe(true);
      expect(Validator.email({})).toBe(true);
    });
  });

  describe('當：minLength 驗證器', () => {
    it('當：字串長度小於最小值時，應該：回傳 false', () => {
      expect(Validator.minLength('12345', 6)).toBe(false);
      expect(Validator.minLength('a', 2)).toBe(false);
    });

    it('當：字串長度等於最小值時，應該：回傳 true', () => {
      expect(Validator.minLength('123456', 6)).toBe(true);
      expect(Validator.minLength('a', 1)).toBe(true);
    });

    it('當：字串長度大於最小值時，應該：回傳 true', () => {
      expect(Validator.minLength('1234567', 6)).toBe(true);
      expect(Validator.minLength('test string', 5)).toBe(true);
    });

    it('當：給定空字串或 undefined 時，應該：回傳 true（選填欄位）', () => {
      expect(Validator.minLength('', 6)).toBe(true);
      expect(Validator.minLength(undefined, 6)).toBe(true);
      expect(Validator.minLength(null, 6)).toBe(true);
    });

    it('當：給定非字串類型時，應該：回傳 true', () => {
      expect(Validator.minLength(123, 6)).toBe(true);
      expect(Validator.minLength([], 6)).toBe(true);
    });
  });

  describe('當：maxLength 驗證器', () => {
    it('當：字串長度大於最大值時，應該：回傳 false', () => {
      expect(Validator.maxLength('1234567', 6)).toBe(false);
    });

    it('當：字串長度等於最大值時，應該：回傳 true', () => {
      expect(Validator.maxLength('123456', 6)).toBe(true);
    });

    it('當：字串長度小於最大值時，應該：回傳 true', () => {
      expect(Validator.maxLength('12345', 6)).toBe(true);
    });

    it('當：給定空字串或 undefined 時，應該：回傳 true', () => {
      expect(Validator.maxLength('', 6)).toBe(true);
      expect(Validator.maxLength(undefined, 6)).toBe(true);
      expect(Validator.maxLength(null, 6)).toBe(true);
    });
  });

  describe('當：pattern 驗證器', () => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    it('當：值符合正則模式時，應該：回傳 true', () => {
      expect(Validator.pattern('123-456-7890', phoneRegex)).toBe(true);
      expect(Validator.pattern('test@example.com', emailRegex)).toBe(true);
    });

    it('當：值不符合正則模式時，應該：回傳 false', () => {
      expect(Validator.pattern('abc-456-7890', phoneRegex)).toBe(false);
      expect(Validator.pattern('invalid-email', emailRegex)).toBe(false);
    });

    it('當：給定空字串或 undefined 時，應該：回傳 true', () => {
      expect(Validator.pattern('', phoneRegex)).toBe(true);
      expect(Validator.pattern(undefined, phoneRegex)).toBe(true);
      expect(Validator.pattern(null, phoneRegex)).toBe(true);
    });
  });

  describe('當：noXSS 安全驗證器', () => {
    it('當：包含 script 標籤時，應該：回傳 false', () => {
      expect(Validator.noXSS('<script>alert("xss")</script>')).toBe(false);
      expect(Validator.noXSS('<SCRIPT>alert("xss")</SCRIPT>')).toBe(false);
    });

    it('當：包含 javascript: 協議時，應該：回傳 false', () => {
      expect(Validator.noXSS('javascript:alert("xss")')).toBe(false);
      expect(Validator.noXSS('JAVASCRIPT:alert("xss")')).toBe(false);
    });

    it('當：包含事件處理器時，應該：回傳 false', () => {
      expect(Validator.noXSS('onclick=alert("xss")')).toBe(false);
      expect(Validator.noXSS('onload=alert("xss")')).toBe(false);
      expect(Validator.noXSS('onerror=alert("xss")')).toBe(false);
    });

    it('當：包含危險標籤時，應該：回傳 false', () => {
      expect(Validator.noXSS('<iframe src="malicious.com"></iframe>')).toBe(
        false
      );
      expect(Validator.noXSS('<object data="malicious.swf"></object>')).toBe(
        false
      );
      expect(Validator.noXSS('<embed src="malicious.swf">')).toBe(false);
    });

    it('當：包含 eval 或 expression 時，應該：回傳 false', () => {
      expect(Validator.noXSS('eval(malicious_code)')).toBe(false);
      expect(Validator.noXSS('expression(malicious_code)')).toBe(false);
    });

    it('當：為正常文本時，應該：回傳 true', () => {
      expect(Validator.noXSS('Hello world')).toBe(true);
      expect(
        Validator.noXSS('This is a normal message with <b>bold</b> text')
      ).toBe(true);
      expect(Validator.noXSS('Contact us at info@company.com')).toBe(true);
    });

    it('當：給定空值時，應該：回傳 true', () => {
      expect(Validator.noXSS('')).toBe(true);
      expect(Validator.noXSS(undefined)).toBe(true);
      expect(Validator.noXSS(null)).toBe(true);
    });
  });

  describe('當：noSQLInjection 安全驗證器', () => {
    // 根據 sql-injection-validator-issue.md 的測試案例
    describe('當：檢測正常文本時', () => {
      it('應該：允許包含正常英文連接詞的文本', () => {
        const normalTexts = [
          'Sales expert and coach',
          'Hello and welcome to our service',
          'Please select from the following options',
          'You can insert into the conversation naturally',
          'This will update your profile',
          'Delete from memory if needed',
        ];

        normalTexts.forEach(text => {
          expect(Validator.noSQLInjection(text)).toBe(true);
        });
      });

      it('應該：允許包含正常引號的對話文本', () => {
        const quotedTexts = [
          'He said "hello" to me',
          "She replied 'yes' to the question",
          'The book title is "Learning SQL"',
          "It's a beautiful day",
        ];

        quotedTexts.forEach(text => {
          expect(Validator.noSQLInjection(text)).toBe(true);
        });
      });

      it('應該：允許包含 SQL 關鍵字但非攻擊性的文檔內容', () => {
        const documentTexts = [
          'Please select from options',
          'Insert into conversation',
          'Update your settings',
          'Delete from list',
          'Union of two sets',
          'Create new account',
        ];

        documentTexts.forEach(text => {
          expect(Validator.noSQLInjection(text)).toBe(true);
        });
      });
    });

    describe('當：檢測真實 SQL 注入攻擊時', () => {
      it('應該：阻止引號內的 SQL 關鍵字注入', () => {
        const injectionAttacks = [
          "1' OR '1'='1' --",
          "admin' OR 1=1 --",
          "'; SELECT * FROM users --",
          "' UNION SELECT password FROM users --",
          "' AND 1=1 --",
        ];

        injectionAttacks.forEach(attack => {
          expect(Validator.noSQLInjection(attack)).toBe(false);
        });
      });

      it('應該：阻止堆疊查詢攻擊', () => {
        const stackedQueries = [
          "'; DROP TABLE users; --",
          '; DELETE FROM passwords;',
          "; INSERT INTO admin VALUES ('hacker', 'password');",
          "; UPDATE users SET role='admin' WHERE id=1;",
        ];

        stackedQueries.forEach(query => {
          expect(Validator.noSQLInjection(query)).toBe(false);
        });
      });

      it('應該：阻止聯合注入攻擊', () => {
        const unionAttacks = [
          "1' UNION SELECT * FROM passwords",
          "admin' UNION ALL SELECT null, username, password FROM users",
          "' UNION SELECT 1,2,3,4 FROM information_schema.tables",
          'UNION SELECT char(65,66,67) FROM dual',
        ];

        unionAttacks.forEach(attack => {
          expect(Validator.noSQLInjection(attack)).toBe(false);
        });
      });

      it('應該：阻止條件繞過攻擊', () => {
        const bypassAttacks = [
          "admin' OR 1=1 --",
          "' OR '1'='1",
          '1 OR 1=1',
          "admin' OR 'a'='a",
        ];

        bypassAttacks.forEach(attack => {
          expect(Validator.noSQLInjection(attack)).toBe(false);
        });
      });

      it('應該：阻止時間延遲攻擊', () => {
        const timeAttacks = [
          "1'; WAITFOR DELAY '00:00:05'--",
          "admin'; SLEEP(5)--",
          "'; BENCHMARK(5000000,MD5(1))--",
          "1' AND SLEEP(5)--",
        ];

        timeAttacks.forEach(attack => {
          expect(Validator.noSQLInjection(attack)).toBe(false);
        });
      });

      it('應該：阻止錯誤注入攻擊', () => {
        const errorAttacks = [
          "1' AND EXTRACTVALUE(1, version())--",
          "admin' AND UPDATEXML(1, version(), 1)--",
          "'; CAST((SELECT version()) AS int)--",
          "1' AND CONVERT(int, version())--",
        ];

        errorAttacks.forEach(attack => {
          expect(Validator.noSQLInjection(attack)).toBe(false);
        });
      });

      it('應該：阻止存儲過程調用', () => {
        const procedureAttacks = [
          "'; EXEC sp_configure 'show advanced options', 1--",
          "admin'; EXECUTE xp_cmdshell 'dir'--",
          "1'; exec('SELECT * FROM users')--",
          "'; sp_addlogin 'hacker', 'password'--",
        ];

        procedureAttacks.forEach(attack => {
          expect(Validator.noSQLInjection(attack)).toBe(false);
        });
      });
    });

    it('當：給定空值時，應該：回傳 true', () => {
      expect(Validator.noSQLInjection('')).toBe(true);
      expect(Validator.noSQLInjection(undefined)).toBe(true);
      expect(Validator.noSQLInjection(null)).toBe(true);
    });

    it('當：給定非字串類型時，應該：回傳 true', () => {
      expect(Validator.noSQLInjection(123)).toBe(true);
      expect(Validator.noSQLInjection([])).toBe(true);
      expect(Validator.noSQLInjection({})).toBe(true);
    });
  });

  describe('當：safeUrl 驗證器', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('當：給定有效的 HTTP URL 時，應該：回傳 true', () => {
      expect(Validator.safeUrl('http://example.com')).toBe(true);
      expect(Validator.safeUrl('https://secure.example.com')).toBe(true);
      expect(Validator.safeUrl('https://api.service.com/v1/endpoint')).toBe(
        true
      );
    });

    it('當：給定不安全的協議時，應該：回傳 false', () => {
      expect(Validator.safeUrl('javascript:alert("xss")')).toBe(false);
      expect(
        Validator.safeUrl('data:text/html,<script>alert("xss")</script>')
      ).toBe(false);
      expect(Validator.safeUrl('ftp://files.example.com')).toBe(false);
      expect(Validator.safeUrl('file:///etc/passwd')).toBe(false);
    });

    it('當：給定無效的 URL 格式時，應該：回傳 false', () => {
      expect(Validator.safeUrl('not-a-url')).toBe(false);
      expect(Validator.safeUrl('http://')).toBe(false);
      expect(Validator.safeUrl('https://')).toBe(false);
    });

    it('當：在開發環境中給定本地地址時，應該：回傳 true', () => {
      process.env.NODE_ENV = 'development';
      expect(Validator.safeUrl('http://localhost:3000')).toBe(true);
      expect(Validator.safeUrl('http://127.0.0.1:8080')).toBe(true);
    });

    it('當：在生產環境中給定本地地址時，應該：回傳 false', () => {
      process.env.NODE_ENV = 'production';
      expect(Validator.safeUrl('http://localhost:3000')).toBe(false);
      expect(Validator.safeUrl('http://127.0.0.1:8080')).toBe(false);
      expect(Validator.safeUrl('http://0.0.0.0:3000')).toBe(false);
    });

    it('當：給定空值時，應該：回傳 true', () => {
      expect(Validator.safeUrl('')).toBe(true);
      expect(Validator.safeUrl(undefined)).toBe(true);
      expect(Validator.safeUrl(null)).toBe(true);
    });
  });

  describe('當：safeFilename 驗證器', () => {
    it('當：給定安全的檔案名稱時，應該：回傳 true', () => {
      expect(Validator.safeFilename('document.pdf')).toBe(true);
      expect(Validator.safeFilename('image_001.jpg')).toBe(true);
      expect(Validator.safeFilename('report-2024.docx')).toBe(true);
      expect(Validator.safeFilename('data.csv')).toBe(true);
    });

    it('當：包含路徑遍歷時，應該：回傳 false', () => {
      expect(Validator.safeFilename('../../../etc/passwd')).toBe(false);
      expect(Validator.safeFilename('..\\windows\\system32\\config')).toBe(
        false
      );
    });

    it('當：包含 Windows 不允許字符時，應該：回傳 false', () => {
      expect(Validator.safeFilename('file<name>.txt')).toBe(false);
      expect(Validator.safeFilename('file>name.txt')).toBe(false);
      expect(Validator.safeFilename('file:name.txt')).toBe(false);
      expect(Validator.safeFilename('file"name.txt')).toBe(false);
      expect(Validator.safeFilename('file|name.txt')).toBe(false);
      expect(Validator.safeFilename('file?name.txt')).toBe(false);
      expect(Validator.safeFilename('file*name.txt')).toBe(false);
    });

    it('當：為 Windows 保留名稱時，應該：回傳 false', () => {
      expect(Validator.safeFilename('CON')).toBe(false);
      expect(Validator.safeFilename('PRN')).toBe(false);
      expect(Validator.safeFilename('AUX')).toBe(false);
      expect(Validator.safeFilename('NUL')).toBe(false);
      expect(Validator.safeFilename('COM1')).toBe(false);
      expect(Validator.safeFilename('LPT1')).toBe(false);
    });

    it('當：為可執行檔案時，應該：回傳 false', () => {
      expect(Validator.safeFilename('malware.exe')).toBe(false);
      expect(Validator.safeFilename('script.bat')).toBe(false);
      expect(Validator.safeFilename('virus.scr')).toBe(false);
      expect(Validator.safeFilename('trojan.com')).toBe(false);
    });

    it('當：為隱藏檔案時，應該：回傳 false', () => {
      expect(Validator.safeFilename('.htaccess')).toBe(false);
      expect(Validator.safeFilename('.env')).toBe(false);
    });

    it('當：給定空值時，應該：回傳 true', () => {
      expect(Validator.safeFilename('')).toBe(true);
      expect(Validator.safeFilename(undefined)).toBe(true);
      expect(Validator.safeFilename(null)).toBe(true);
    });
  });

  describe('當：numberRange 驗證器', () => {
    it('當：數字在範圍內時，應該：回傳 true', () => {
      expect(Validator.numberRange(5, 1, 10)).toBe(true);
      expect(Validator.numberRange(1, 1, 10)).toBe(true);
      expect(Validator.numberRange(10, 1, 10)).toBe(true);
      expect(Validator.numberRange(0, -5, 5)).toBe(true);
    });

    it('當：數字超出範圍時，應該：回傳 false', () => {
      expect(Validator.numberRange(11, 1, 10)).toBe(false);
      expect(Validator.numberRange(0, 1, 10)).toBe(false);
      expect(Validator.numberRange(-6, -5, 5)).toBe(false);
    });

    it('當：給定字串數字時，應該：正確轉換並驗證', () => {
      expect(Validator.numberRange('5', 1, 10)).toBe(true);
      expect(Validator.numberRange('15', 1, 10)).toBe(false);
    });

    it('當：給定無效數字時，應該：回傳 false', () => {
      expect(Validator.numberRange('abc', 1, 10)).toBe(false);
      expect(Validator.numberRange('', 1, 10)).toBe(false);
      expect(Validator.numberRange(NaN, 1, 10)).toBe(false);
    });

    it('當：給定空值時，應該：回傳 true', () => {
      expect(Validator.numberRange(null, 1, 10)).toBe(true);
      expect(Validator.numberRange(undefined, 1, 10)).toBe(true);
    });
  });

  describe('當：phoneNumber 驗證器', () => {
    it('當：給定有效的台灣手機號碼時，應該：回傳 true', () => {
      expect(Validator.phoneNumber('0912345678')).toBe(true);
      expect(Validator.phoneNumber('886912345678')).toBe(true);
      expect(Validator.phoneNumber('+886912345678')).toBe(true);
      expect(Validator.phoneNumber('09-1234-5678')).toBe(true);
      expect(Validator.phoneNumber('0987 654 321')).toBe(true);
    });

    it('當：給定有效的台灣市話號碼時，應該：回傳 true', () => {
      expect(Validator.phoneNumber('0223456789')).toBe(true);
      expect(Validator.phoneNumber('037123456')).toBe(true);
      expect(Validator.phoneNumber('04-2345-6789')).toBe(true);
      expect(Validator.phoneNumber('(07) 123-4567')).toBe(true);
    });

    it('當：給定無效的電話號碼時，應該：回傳 false', () => {
      expect(Validator.phoneNumber('123')).toBe(false);
      expect(Validator.phoneNumber('0123456789')).toBe(false); // 0 開頭但不是有效格式
      expect(Validator.phoneNumber('1234567890')).toBe(false); // 不是台灣格式
      expect(Validator.phoneNumber('09123456789')).toBe(false); // 手機號碼過長
    });

    it('當：給定空值時，應該：回傳 true', () => {
      expect(Validator.phoneNumber('')).toBe(true);
      expect(Validator.phoneNumber(undefined)).toBe(true);
      expect(Validator.phoneNumber(null)).toBe(true);
    });
  });

  describe('當：sanitizeString 清理器', () => {
    it('當：包含 HTML 標籤時，應該：移除危險字符', () => {
      expect(
        Validator.sanitizeString('Hello <script>alert("xss")</script> World')
      ).toBe('Hello scriptalert("xss")/script World');
      expect(Validator.sanitizeString('Text with <b>bold</b> formatting')).toBe(
        'Text with bbold/b formatting'
      );
    });

    it('當：包含 JavaScript 協議時，應該：移除', () => {
      expect(Validator.sanitizeString('javascript:alert("xss")')).toBe(
        'alert("xss")'
      );
      expect(Validator.sanitizeString('JAVASCRIPT:malicious()')).toBe(
        'malicious()'
      );
    });

    it('當：包含事件處理器時，應該：移除', () => {
      expect(Validator.sanitizeString('onclick=alert("xss")')).toBe(
        'alert("xss")'
      );
      expect(Validator.sanitizeString('onload=malicious()')).toBe(
        'malicious()'
      );
    });

    it('當：字串過長時，應該：截斷至 1000 字符', () => {
      const longString = 'a'.repeat(1500);
      const result = Validator.sanitizeString(longString);
      expect(result.length).toBe(1000);
      expect(result).toBe('a'.repeat(1000));
    });

    it('當：包含前後空白時，應該：去除', () => {
      expect(Validator.sanitizeString('  hello world  ')).toBe('hello world');
      expect(Validator.sanitizeString('\t\ntest\r\n')).toBe('test');
    });

    it('當：給定正常文本時，應該：保持原樣', () => {
      expect(Validator.sanitizeString('Hello World')).toBe('Hello World');
      expect(Validator.sanitizeString('Normal text 123')).toBe(
        'Normal text 123'
      );
    });

    it('當：給定空值時，應該：回傳空字串', () => {
      expect(Validator.sanitizeString('')).toBe('');
      expect(Validator.sanitizeString(undefined)).toBe('');
      expect(Validator.sanitizeString(null)).toBe('');
    });

    it('當：給定非字串類型時，應該：回傳空字串', () => {
      expect(Validator.sanitizeString(123)).toBe('');
      expect(Validator.sanitizeString([])).toBe('');
      expect(Validator.sanitizeString({})).toBe('');
    });
  });
});
