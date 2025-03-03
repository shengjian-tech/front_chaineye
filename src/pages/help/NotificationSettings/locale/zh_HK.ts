const zh_HK = {
  title: '通知設定',
  webhooks: {
    title: '回撥地址',
    enable: '啟用',
    note: '備註',
    url: 'URL',
    timeout: '超時 (單位： s)',
    basic_auth_user: '使用者名稱 (Basic Auth)',
    basic_auth_password: '密碼 (Basic Auth)',
    skip_verify: '跳過 SSL 驗證',
    add: '新增',
    help: `
      尊敬的夜鶯用戶，您好，如果您想把夜鶯告警事件全部轉發到另一個平台處理，可以通過這裡的全局回調地址來實現。
      <br />
      <br />
      近期快貓團隊提供的事件OnCall產品FlashDuty也開始公測了，歡迎體驗，把各個監控系統的告警事件統一推給FlashDuty，享受告警聚合降噪、排班、認領、升級、協同處理一站式體驗。
      <br />
      <br />
      <a href='https://console.shengjian.net/?from=n9e' target='_blank'>
      免費體驗地址
      </a>
    `,
  },
  script: {
    title: '通知腳本',
    enable: '啟用',
    timeout: '超時 (單位： s)',
    type: ['使用腳本', '使用路徑'],
    path: '檔案路徑',
    content: '腳本內容',
  },
  channels: {
    title: '通知媒介',
    name: '名稱',
    ident: '標識',
    ident_msg1: '標識只能包含字母、數字、下劃線和中劃線',
    ident_msg2: '標識已存在',
    hide: '隱藏',
    add: '新增',
    add_title: '新增通知媒介',
    edit_title: '編輯通知媒介',
    enabled: '啟用',
  },
  contacts: {
    title: '聯繫方式',
    add_title: '新增聯繫方式',
    edit_title: '編輯聯繫方式',
  },
  smtp: {
    title: 'SMTP 設定',
    testMessage: '已發送測試郵件，請查收',
  },
  ibex: {
    title: '自愈配置',
  },
};

export default zh_HK;
