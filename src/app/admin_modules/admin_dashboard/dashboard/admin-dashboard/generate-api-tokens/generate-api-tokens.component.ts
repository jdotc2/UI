import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../../../services/user-data.service';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { EditTokenModalComponent } from '../modal/edit-token-modal/edit-token-modal.component';
import { GenerateApiTokenModalComponent } from '../modal/generate-api-token-modal/generate-api-token-modal.component';
import {GeneralDashboardDeleteComponent} from '../../../../../shared/modals/general-dashboard-delete/general-dashboard-delete.component';

@Component({
  selector: 'app-generate-tokens',
  templateUrl: './generate-api-tokens.component.html',
  styleUrls: ['./generate-api-tokens.component.scss'],
})
export class GenerateApiTokensComponent implements OnInit {

  error: any = {};
  apitokens: any[] = [];
  tokenSearch = '';
  constructor(private userData: UserDataService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadApiToken();
  }

  loadApiToken() {
    this.userData.apitokens().subscribe((response: any) => {
      this.apitokens = response;
    });
  }

  editToken(apitoken) {
    this.openModal(apitoken);
  }

  generateToken() {
    const modalRef = this.modalService.open(GenerateApiTokenModalComponent );
    modalRef.result.then((newConfig) => {
    }).catch((error) => {
      this.loadApiToken();
    });
  }

  deleteToken(apiToken) {
    const modalRef = this.modalService.open(GeneralDashboardDeleteComponent);
    modalRef.componentInstance.title = `Are you sure you want to delete ${apiToken.apiUser}?`;
    modalRef.result.then((newConfig) => {
      this.userData.deleteToken(apiToken.id).subscribe(response => {
        this.loadApiToken();
      });
    }).catch((error) => {
      console.log('delete error newConfig :' + error);

    });
  }

  openModal(item) {
    const modalRef = this.modalService.open(EditTokenModalComponent);
    modalRef.componentInstance.tokenItem = item;
    modalRef.componentInstance.apiUser = item.apiUser;
    modalRef.componentInstance.date = this.parseNgbDate(item.expirationDt);
    modalRef.result.then((newConfig) => {
      this.loadApiToken();
    }).catch((error) => {
      this.loadApiToken();
    });
  }

  parseNgbDate(value: string): NgbDateStruct | null {
    if (value) {
      const date = new Date(value);
      return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };
    }
    return null;
  }

}
