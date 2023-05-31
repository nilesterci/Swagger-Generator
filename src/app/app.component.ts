import { AppService } from './app.service';
import { Component, ViewChild } from '@angular/core';
import {
  PoDynamicFormField,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
} from '@po-ui/ng-components';
import { NgForm } from '@angular/forms';
import { Req } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('optionsForm', { static: true }) form: NgForm;
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  newReq: Req = new Req();
  title = 'my-po-project';
  last: string;
  credential: string;

  req = {
    url: '',
    tipo: '',
    token: '',
    json: '',
    credential: '',
  };
  validateFields: Array<string> = [
    'url',
    'tipo',
    'token',
    'json',
    'credential',
  ];

  fields: Array<PoDynamicFormField> = [
    {
      property: 'url',
      required: false,
      minLength: 1,
      maxLength: 1000,
      gridColumns: 11,
      gridSmColumns: 12,
      order: 1,
      placeholder: 'URL',
    },
    {
      property: 'tipo',
      required: false,
      minLength: 1,
      maxLength: 50,
      gridColumns: 1,
      gridSmColumns: 12,
      order: 2,
      options: [
        { label: 'GET', value: 'get' },
        { label: 'POST', value: 'post' },
        { label: 'PUT', value: 'put' },
        { label: 'DELETE', value: 'delete' },
      ],
    },
    {
      property: 'token',
      label: 'Token',
      gridColumns: 12,
      gridSmColumns: 12,
      placeholder: 'Token',
    },
    {
      property: 'json',
      label: 'JSON',
      gridColumns: 12,
      gridSmColumns: 12,
      rows: 5,
      placeholder: 'JSON da requisição',
    },
  ];

  constructor(
    public poNotification: PoNotificationService,
    private registerService: AppService
  ) {}

  ngOnInit() {}

  sendReq() {
    this.registerService.sendGet(this.req).subscribe(
      (result) => {
        var keyNames = Object.keys(result.result);
        var last = keyNames[keyNames.length - 1];

        this.geraSchema(result.result[last][0], last);
        this.geraPath();
        this.closeModal();
      },
      (error) => {
        this.poNotification.error('Erro ao gerar SWAGGER');
      }
    );
  }

  sendReqToken() {
    if(this.req.token){
      this.sendReq();
    }else{
      this.registerService.getToken(this.req).subscribe(
        (result) => {
            this.req.token = result.result.access_token;
            this.sendReq();
            this.closeModal();
        },
        (error) => {
          this.poNotification.error('Erro ao gerar TOKEN');
        }
      );
    }

  }

  geraSchema(obj: any, last) {
    let properties: any;
    let textoIn: any;
    let fim: any;

    Object.keys(obj).forEach((key) => {
      textoIn = {
        [key]: {
          type: 'integer',
        },
      };

      properties = { ...properties, ...textoIn };
    });
    fim = {
      type: 'object',
      properties,
    };

    var json = '{"' + last + '":' + JSON.stringify(fim) + '}';

    this.last = last;

    this.escreveArquivo(json, 'schema');
  }

  geraPath() {
    let parameters: any;
    let textoIn: any;
    let fim: any;
    let arr: any = [];

    let url = this.req.url.split('?');

    let params = url[1].split('&');

    Object.keys(params).forEach((key) => {
      let variavelParam = params[key].split('=');

      textoIn = {
        name: variavelParam[0],
        in: 'query',
        required: variavelParam[1] ? true : false,
        schema: {
          type: 'integer',
        },
      };

      parameters = { ...parameters, ...textoIn };
      arr.push(textoIn);
    });

    textoIn = {
      name: 'version',
      in: 'path',
      required: true,
      schema: {
        type: 'string',
      },
    };

    arr.push(textoIn);

    let path = this.req.url.replace('api/v1', '/api/v{version}');
    let path2 = path.split('?');
    fim = {
      [path2[0]]: {
        get: {
          tags: ['CONTROLLER'],
          parameters: arr,
          responses: {
            '200': {
              description: 'Success',
              content: {
                'text/plain': {
                  schema: {
                    $ref: '#/components/schemas/' + this.last,
                  },
                },
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/' + this.last,
                  },
                },
                'text/json': {
                  schema: {
                    $ref: '#/components/schemas/' + this.last,
                  },
                },
              },
            },
          },
        },
      },
    };

    var json = '{"paths":' + JSON.stringify(fim) + '}';

    this.escreveArquivo(json, 'paths');
  }

  escreveArquivo(valor, nomeArquivo) {
    var file = new Blob([valor], { type: '.txt' });

    var a = document.createElement('a'),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  // MODAL

  accompaniment: string = '';
  fruits: Array<string>;
  orderDetail: string = '';

  close: PoModalAction = {
    action: () => {
      this.closeModal();
    },
    label: 'Close',
    danger: true,
  };

  confirm: PoModalAction = {
    action: () => {
      this.proccessOrder();
    },
    label: 'Confirm',
  };

  closeModal() {
    this.form.reset();
    this.poModal.close();
  }

  confirmFruits() {
    this.sendReq();
  }

  restore() {
    this.form.reset();
  }

  openModal() {
    this.req.url = this.removeHttp(this.req.url)
    if (this.req.token) {
      this.sendReq();
    }else{
      this.poModal.open();
    }

  }

  removeHttp(url) {
    return url.replace(/^https?:\/\//, '');
  }

  private proccessOrder() {
    if (this.form.invalid) {
      const orderInvalidMessage = 'Choose the items to confirm the order.';
      this.poNotification.warning(orderInvalidMessage);
    } else {
      this.confirm.loading = true;

      setTimeout(() => {
        this.poNotification.success(
          `Your order confirmed: ${this.fruits}, with accompaniment: ${this.accompaniment}.`
        );
        this.confirm.loading = false;
        this.closeModal();
      }, 700);
    }
  }
}
