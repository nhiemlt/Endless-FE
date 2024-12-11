import React, { useState, useEffect } from 'react';

const FptChatbotButton = () => {
  const [isChatbotVisible, setIsChatbotVisible] = useState(true);

  useEffect(() => {
    if (isChatbotVisible) {
      // Configs
      const liveChatBaseUrl = document.location.protocol + '//' + 'livechat.fpt.ai/v36/src';
      const LiveChatSocketUrl = 'livechat.fpt.ai:443';
      let FptAppCode = '767708d8fa96ca266db06a4e46410cc0'; // Ensure this is declared as let so it can be reassigned
      const FptAppName = 'Bot Endless';

      // Define custom styles
      const CustomStyles = {
        headerBackground: 'linear-gradient(86.7deg, #010102FF 0.85%, #0E75FFFF 98.94%)',
        headerTextColor: '#ffffffff',
        headerLogoEnable: true,
        headerLogoLink: 'https://firebasestorage.googleapis.com/v0/b/endlesstechstoreecommerce.appspot.com/o/sources%2Ffavicon-32x32.png?alt=media&token=7b641632-7986-4a79-bdcc-d0cb2ada0983',
        headerText: 'Hỗ trợ trực tuyến Endless',
        primaryColor: '#0E75FFFF',
        secondaryColor: '#ECECECFF',
        primaryTextColor: '#FFFFFFFF',
        secondaryTextColor: '#000000DE',
        buttonColor: '#b4b4b4ff',
        buttonTextColor: '#ffffffff',
        avatarBot: 'https://firebasestorage.googleapis.com/v0/b/endlesstechstoreecommerce.appspot.com/o/sources%2Fintro.png?alt=media&token=42b2992e-24f7-4...e2ef0a2',
        sendMessagePlaceholder: 'Nhập tin nhắn',
        floatButtonLogo: 'https://firebasestorage.googleapis.com/v0/b/endlesstechstoreecommerce.appspot.com/o/sources%2Fwhite-logo.png?alt=media&token=e798ffdc-8296-46c1-ae46-a3ac78061f7e',
        floatButtonTooltip: 'Endless xin chào',
        customerLogo: 'https://firebasestorage.googleapis.com/v0/b/endlesstechstoreecommerce.appspot.com/o/sources%2Fintro.png?alt=media&token=42b2992e-24f7-4...e2ef0a2',
        customerWelcomeText: 'Vui lòng nhập tên của bạn',
        customerButtonText: 'Bắt đầu',
        prefixEnable: false,
        prefixType: 'radio',
        prefixOptions: ["Anh", "Chị"],
        prefixPlaceholder: 'Danh xưng',
        css: ''
      };

      // Get bot code from URL if FptAppCode is empty
      if (!FptAppCode) {
        const appCodeFromHash = window.location.hash.substr(1);
        if (appCodeFromHash.length === 32) {
          FptAppCode = appCodeFromHash;
        }
      }

      // Set Configs
      const FptLiveChatConfigs = {
        appName: FptAppName,
        appCode: FptAppCode,
        themes: '',
        styles: CustomStyles
      };

      // Append Script
      const FptLiveChatScript = document.createElement('script');
      FptLiveChatScript.id = 'fpt_ai_livechat_script';
      FptLiveChatScript.src = `${liveChatBaseUrl}/static/fptai-livechat.js`;
      document.body.appendChild(FptLiveChatScript);

      // Append Stylesheet
      const FptLiveChatStyles = document.createElement('link');
      FptLiveChatStyles.id = 'fpt_ai_livechat_styles';
      FptLiveChatStyles.rel = 'stylesheet';
      FptLiveChatStyles.href = `${liveChatBaseUrl}/static/fptai-livechat.css`;
      document.body.appendChild(FptLiveChatStyles);

      // Init chatbot when script loads
      FptLiveChatScript.onload = () => {
        
        if (window.fpt_ai_render_chatbox) {
          window.fpt_ai_render_chatbox(FptLiveChatConfigs, liveChatBaseUrl, LiveChatSocketUrl);
        } else {
          console.error('fpt_ai_render_chatbox is not available.');
        }
        
        const imgElement = document.querySelector('img[alt="logobutton"]');
        if (imgElement) {
          imgElement.style.display = 'inline';  // Đặt thuộc tính display thành inline
        } 
      };

      // Cleanup script and styles when the component is unmounted
      return () => {
        try {
          // Xóa script của livechat
          const script = document.getElementById('fpt_ai_livechat_script');
          if (script) script.remove();

          // Xóa stylesheet của livechat
          const styles = document.getElementById('fpt_ai_livechat_styles');
          if (styles) styles.remove();

          // Xóa container chính của chatbot
          const liveChatContainer = document.getElementById('fpt_ai_livechat_display_container');
          if (liveChatContainer) liveChatContainer.remove();

          // Xóa tất cả các phần tử có class "fpt_ai_livechat_button_blink"
          const blinkButtons = document.querySelectorAll('.fpt_ai_livechat_button_blink');
          blinkButtons.forEach(button => button.remove());

          // Xóa tất cả các phần tử có class "fpt_ai_livechat_button_tooltip"
          const tooltips = document.querySelectorAll('.fpt_ai_livechat_button_tooltip');
          tooltips.forEach(tooltip => tooltip.remove());

          // Vô hiệu hóa thuộc tính `fpt_ai_render_chatbox` trên window
          if (window.fpt_ai_render_chatbox) {
            window.fpt_ai_render_chatbox = null; // Hoặc undefined
          }

          console.log('Chatbot components and resources have been cleaned up successfully.');
        } catch (error) {
          console.error('Error during chatbot cleanup:', error);
        }
      };
    }
  }, [isChatbotVisible]);

  return null;
};

export default FptChatbotButton;
