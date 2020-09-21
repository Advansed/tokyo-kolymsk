import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonButton,
  IonImg,
  IonThumbnail,
} from '@ionic/react';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  src: string;
}

const appPages: AppPage[] = [
  {
    title: 'Каталог',
    url: '/page/Каталог',
    iosIcon: mailOutline,
    mdIcon: mailSharp,
    src: "assets/icon/home.svg",
  },
  {
    title: 'Корзина',
    url: '/page/Корзина',
    iosIcon: heartOutline,
    mdIcon: heartSharp,
    src: "assets/icon/basket.svg",
  },
  {
    title: 'Заказы',
    url: '/page/Акция',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp,
    src: "",
  },
  {
    title: 'История',
    url: '/page/История',
    iosIcon: archiveOutline,
    mdIcon: archiveSharp,
    src: "",
  }
];

const labels = ['Наборы','Акции', 'Скидки'];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonItem>
            <IonListHeader class="a-center">Токио доставка суши</IonListHeader>
            <IonThumbnail slot="end" >
              <IonImg src="assets/tokyo.png" />
            </IonThumbnail>
            {/* <IonNote>hi@ionicframework.com</IonNote> */}
          </IonItem>
          <IonItem>
             <IonLabel>hi@ionicframework.com</IonLabel>
          </IonItem>
          <IonItem>
            <IonButton>Войти</IonButton>
          </IonItem>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon class="m-icon" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} src={ appPage.src } />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Акции, скидки</IonListHeader>
          {labels.map((label, index) => (
            <IonItem lines="none" key={index}>
              <IonIcon slot="start" icon={bookmarkOutline} />
              <IonLabel>{label}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
