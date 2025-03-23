declare module "react-native-instagram-login" {
  import { Component } from "react";

  interface InstagramLoginProps {
    appId: string;
    appSecret?: string;
    redirectUrl: string;
    scopes: string[];
    responseType?: string;
    incognito?: boolean;
    modalVisible?: boolean;
    language?: string;
    onLoginSuccess: (data: any) => void;
    onLoginFailure: (data: any) => void;
    onClose?: () => void;
    renderClose?: () => React.ReactNode;
    containerStyle?: object;
    wrapperStyle?: object;
    closeStyle?: object;
  }

  export default class InstagramLogin extends Component<InstagramLoginProps> {
    show: () => void;
    close: () => void;
  }
}
