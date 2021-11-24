import { moduleMetadata } from '@storybook/angular';
import { APP_BASE_HREF, CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';

import { HeaderComponent } from 'src/app/header/header.component';
import { AuthService } from 'src/app/auth/auth.service';
import {HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from 'src/app/app-routing.module';

export default {
  title: 'Example/Header',
  component: HeaderComponent,
  argTypes: {
    isAuth: [true, false],
    control: { type: 'radio' }
  },
  decorators: [
    moduleMetadata({
      declarations: [HeaderComponent],
      imports: [CommonModule, HttpClientModule, AppRoutingModule],
      providers: [AuthService, {provide: APP_BASE_HREF, useValue : '/' }]
    }),
  ],
} as Meta;

const Template: Story<HeaderComponent> = (args: HeaderComponent) => ({
  component: HeaderComponent,
  props: args,
});



export const LoggedOut = Template.bind({});
LoggedOut.args = {
  isAuth: false
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  isAuth: true
};
