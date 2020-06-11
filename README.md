# Pencil
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7. [A demo web page](https://pencil-b06ba.web.app) is hosted at Firebase hostsing.

Users need to login via their google account.  Once logged in, the users can edit on the page integrated with the [Medium editor](https://github.com/yabwe/medium-editor). The editted content is automatically saved into the Firebase database in near real-time for that users' account without hitting a submit button. To reduce network traffics, the auto-saving is debounced for 10 seconds, meaning auto-saving kicks in if idling more than 10 seconds. When the user logs back in, their last auto-saved documents are retrived and ready for editting.

Users can directly enter LaTeX equestions into the editor inside 2 enclosing $ symbols and once the user is done typing them out, the LaTeX equation is renderred. 
An example,  \$f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi\$ is rendered to $f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \, d\xi$



# Angular 
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


# Firebase
[Handling user authentication with Firebase in your React apps](https://blog.logrocket.com/user-authentication-firebase-react-apps/)

[How to deploy a react app with Firebase hosting](https://medium.com/swlh/how-to-deploy-a-react-app-with-firebase-hosting-98063c5bf425)

# Medium Editor
[Medium Editor](https://github.com/yabwe/medium-editor)

[How to integrate a Medium Editor in Angula-8](https://hub.packtpub.com/how-to-integrate-a-medium-editor-in-angular-8/)

[Angular inline editing with the Medium Editor](https://medium.com/@ole.ersoy/angular-inline-editing-with-the-medium-editor-6a8ca3ad1f70)


# LaTeX
[LaTeX.js](https://github.com/michael-brade/LaTeX.js)