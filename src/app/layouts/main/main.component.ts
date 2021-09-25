import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { GeneralService } from "../../_services/general.service";
import { AuthService } from "../../api/modules/auth.service";
import { ConfirmService } from "../../_services/helpers/confirm.service";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { LocalizationService } from "src/app/_services/helpers/localization.service";
import { LoaderService } from "src/app/_services/helpers/loader.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
})
export class MainComponent implements OnDestroy, OnInit {
  moduleName: string;
  showPreloader = false;
  languages = ["ro", "en", "ru"];
  activeLang = "en";
  menu = [
    {
      text: "Home",
      icon: "home",
      link: "/",
    },
    {
      text: "category",
      icon: "category",
      link: "categories",
    },
    {
      text: "Goods",
      icon: "category",
      link: "goods",
    },
    {
      text: "account",
      icon: "person",
      link: "users",
    },
    {
      text: "Roles",
      icon: "people_alt",
      link: "roles",
    },
    {
      text: "Exit",
      icon: "logout",
      link: "item",
    },
  ] as Array<{
    text: string;
    icon: string;
    link: string;
  }>;
  notifySubject = new EventEmitter();

  constructor(
    public generalService: GeneralService,
    private authService: AuthService,
    private confirmService: ConfirmService,
    private router: Router,
    public localize: LocalizationService,
    private loader: LoaderService
  ) {
    this.activeLang = localize.activeLanguage;
    loader.showGlobalLoader();
    this.moduleNameChanges();

    generalService.showGlobalPreloader.subscribe((data) => {
      this.showPreloader = data;
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loader.hideGlobalLoader();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.notifySubject.next(false);
    this.notifySubject.complete();
  }

  moduleNameChanges(): void {
    this.generalService.moduleName
      .pipe(takeUntil(this.notifySubject))
      .subscribe((event: string) => {
        if (event) {
          this.moduleName = event;
        }
      });
  }

  async logout(): Promise<void> {
    this.confirmService.setConfirm({
      accept: async () => {
        this.authService.logout();

        localStorage.removeItem("credentials");
        this.router.navigateByUrl("/auth");
      },
      title: "Logout!",
      message: "Are you sure you want to exit?",
    });
  }

  changeLanguage(): void {
    this.localize.onLanguageChange.next(this.activeLang);
  }
}
