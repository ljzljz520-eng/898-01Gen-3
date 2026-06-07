import type { SensitiveResult } from '@/types';

const SENSITIVE_PATTERNS: Record<string, string[]> = {
  prescription: ['处方', '开药', '药方', '配药'],
  dosage: ['mg', 'g', 'ml', '毫克', '克', '毫升', '每次', '每日', '剂量', '服用量'],
  privacy: ['手机号', '电话', '微信', 'QQ', '地址', '身份证', '医保号'],
  medicalAdvice: ['建议你', '你应该', '必须', '不要吃', '一定要']
};

export function checkSensitiveContent(content: string, title?: string): SensitiveResult {
  const flags: string[] = [];
  const matchedWords: string[] = [];
  const fullContent = title ? `${title} ${content}` : content;

  Object.entries(SENSITIVE_PATTERNS).forEach(([type, patterns]) => {
    patterns.forEach(pattern => {
      if (fullContent.toLowerCase().includes(pattern.toLowerCase())) {
        if (!flags.includes(type)) {
          flags.push(type);
        }
        if (!matchedWords.includes(pattern)) {
          matchedWords.push(pattern);
        }
      }
    });
  });

  return {
    hasSensitive: flags.length > 0,
    flags,
    matchedWords
  };
}

export function highlightSensitiveContent(content: string, matchedWords: string[]): string {
  let result = content;
  matchedWords.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    result = result.replace(regex, '<mark class="bg-red-100 text-red-700 px-0.5 rounded">$1</mark>');
  });
  return result;
}

export function maskSensitiveContent(content: string, matchedWords: string[]): string {
  let result = content;
  matchedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    result = result.replace(regex, '***');
  });
  return result;
}
