import ViewBase from "../core/ViewBase";
import intl from "react-intl-universal";

export default class ExchangeViewBase extends ViewBase {
  constructor(props) {
    super(props);
    // this.history = props.history;
    // this.match = props.match;
    this.intl = intl;
    this.location = "";
    // img标签引用图片路径统一管理
    this.$imagesMap = {
      // $header_cn:   resolveStaticPath("/web/header/cn.svg"), // 头部
      // $header_en:   resolveStaticPath("/web/header/en.svg"),
      // $logo_footer:   resolveStaticPath("/logo/logo_footer.svg"), // 底部
      // $footer_twitter:   resolveStaticPath("/web/footer/twitter_new.svg"),
      // $footer_faceBook:   resolveStaticPath("/web/footer/FaceBook_new.svg"),
      // $footer_wb:   resolveStaticPath("/web/footer/wb.svg"),
      // $footer_wechat:   resolveStaticPath("/web/footer/wechat.svg"),
      // $footer_telegram:   resolveStaticPath("/web/footer/Telegram_new.svg"),
      // $home_marketBtn:   resolveStaticPath("/web/home/home_search_btn.svg"), // 首页
      // $home_financial:   resolveStaticPath("/web/home/financial@2x.png"),
      // $home_safe:   resolveStaticPath("/web/home/4_2.svg"),
      // $home_stable:   resolveStaticPath("/web/home/4_3.svg"),
      // $home_muti:   resolveStaticPath("/web/home/muti@2x.png"),
      // $home_advan_1:   resolveStaticPath('/web/home/advantage_1.png'),
      // $home_advan_2:   resolveStaticPath('/web/home/advantage_2.png'),
      // $home_advan_3:   resolveStaticPath('/web/home/advantage_3.png'),
      // $home_advan_4:   resolveStaticPath('/web/home/advantage_4.png'),
      // $trade_search:   resolveStaticPath("/web/search_bai.svg"), // 市场
      // $trade_close:   resolveStaticPath("/web/guanbi_bai.svg"),
      // $trade_rank:   resolveStaticPath("/web/trade/trade_rank.svg"),
      // $trade_star:   resolveStaticPath("/web/trade/trade_star.svg"),
      // $trade_star_select:   resolveStaticPath("/web/trade/trade_star_select.svg"),
      // $guanbi_hei:   resolveStaticPath("/web/guanbi_hei.svg"),
      // $warning:   resolveStaticPath("/web/pop_warn.svg"),
      // $succeed:   resolveStaticPath("/web/pop_right.svg"),
      // $wrong:   resolveStaticPath("/web/pop_error.svg"),
      // $message:   resolveStaticPath("/web/message.svg"),
      // $yiwen:   resolveStaticPath("/web/yiwen.svg"),
      // $yiwen_active:   resolveStaticPath("/web/yiwen_active.svg"),
      // $yiwen_active_light:   resolveStaticPath("/web/yiwen_active_light.svg"),
      // $rank_down:   resolveStaticPath("/web/home/rank_down.svg"),
      // $rank_up:   resolveStaticPath("/web/home/rank_up.svg"),
      // $rank_normal:   resolveStaticPath("/web/home/rank_normal.svg"),
      // $xianghu:   resolveStaticPath("/web/xianghu.svg"),
      // $award_success:   resolveStaticPath("/web/genrealize/success.png"),
      // $nomal_down:   resolveStaticPath("/web/home/down_normal.svg"),
      // $checked:   resolveStaticPath("/web/checked.svg"),
      // $nomal_check:   resolveStaticPath("/web/normal_check.svg"),
      // $checkbox_check:   resolveStaticPath("/web/checkbox_checked.svg"),
      // $home_star_sel:   resolveStaticPath("/web/home/star_select.svg"),
      // $home_star_nor:   resolveStaticPath("/web/home/star_normal.svg"),
      // $user_recommendCn:   resolveStaticPath("/web/user/recommend_cn.svg"), // 个人中心图片
      // $user_recommendEn:   resolveStaticPath("/web/user/recommendEn.svg"),
      // $user_loading:   resolveStaticPath("/web/user/loading.png"),
      // $home_user_notice:   resolveStaticPath("/web/home/new_bai.svg"),
      // $invite:   resolveStaticPath("/web/genrealize/invite.png"),
      // $aside_erweima:   resolveStaticPath("/web/footer/erweima.png"),
      // $calendar_preYear:   resolveStaticPath("/web/calendar/calendar_pre_year.svg"), // 日历
      // $calendar_nextYear:   resolveStaticPath("/web/calendar/calendar_next_year.svg"),
      // $calendar_preMonth:   resolveStaticPath("/web/calendar/calendar_pre_month.svg"),
      // $calendar_nextMonth:   resolveStaticPath("/web/calendar/calendar_next_month.svg"),
      // $address_code_normal:   resolveStaticPath("/web/asset/code_normal.svg"),
      // $address_code_hover:   resolveStaticPath("/web/asset/code_hover.svg"),
      // $order_checked:   resolveStaticPath("/web/icon_checkbox_click@3x.png"),
      // $order_unchecked:   resolveStaticPath("/web/icon_checkbox_normal@3x.png"),
      // $asset_closed:   resolveStaticPath("/web/asset/closed_copy.png"),

      // $activty_giving_bg:   resolveStaticPath("/web/activityGiving/bg@3x.png"),

      // $h5_logo:   resolveStaticPath("/logo/logo_h5.png"), // h5图片
      // $h5_user_identity:   resolveStaticPath('/mobile/user/icon_wd_sfrz@3x.png'),
      // $h5_user_safe:   resolveStaticPath('/mobile/user/icon_wd_aqzx@3x.png'),
      // $h5_user_order:   resolveStaticPath('/mobile/user/icon_wd_ddgl@3x.png'),
      // $h5_user_help:   resolveStaticPath('/mobile/user/icon_wd_bzzx@3x.png'),
      // $h5_user_inviteIcon:   resolveStaticPath('/mobile/user/icon_wdyq_active@3x.png'),
      // $h5_user_terms:   resolveStaticPath('/mobile/user/icon_wd_yhxy@3x.png'),
      // $h5_user_about:   resolveStaticPath('/mobile/user/icon_wd_gywm@3x.png'),
      // $h5_user_qianjb:   resolveStaticPath('/mobile/user/icon_qianjb@3x.png'),
      // $h5_header_header:   resolveStaticPath("/mobile/header/icon_wode_head@2x.png"),
      // $h5_header_home:   resolveStaticPath("/mobile/header/icon_sy@2x.png"),
      // $h5_header_home_active:   resolveStaticPath("/mobile/header/icon_sy_active.png"),
      // $h5_header_asset:   resolveStaticPath("/mobile/header/icon_zc@2x.png"),
      // $h5_header_order:   resolveStaticPath("/mobile/header/icon_dd@2x.png"),
      // $h5_header_user:   resolveStaticPath("/mobile/header/icon_gr@2x.png"),
      // $h5_header_user_active:   resolveStaticPath("/mobile/header/icon_gr_active.png"),
      // $h5_header_invite:   resolveStaticPath("/mobile/header/icon_wdyq@3x.png"),
      // $h5_header_invite_active:   resolveStaticPath("/mobile/header/icon_wdyq_active@3x.png"),
      // $h5_header_language:   resolveStaticPath("/mobile/header/icon_yy@2x.png"),

      // $h5_search:   resolveStaticPath('/mobile/icon_search_big.png'),
      // $h5_order_select:   resolveStaticPath('/mobile/order/icon_shaixuan@3x.png'),
      // $h5_back:   resolveStaticPath("/mobile/back_white@3x.png"),
      // $h5_user_about_anquan:   resolveStaticPath("/mobile/user/icon_wd_gywm_anquan@2x.png"),
      // $h5_user_about_pinzhi:   resolveStaticPath("/mobile/user/icon_wd_gywm_pinzhi@2x.png"),
      // $h5_activity_qb:   resolveStaticPath("/mobile/activity/icon_coin_qb@2x.png"),
      // $h5_activity_qb_num:   resolveStaticPath("/mobile/activity/icon_qb_zhye@2x.png"),
      // $h5_activity_qb_heart:   resolveStaticPath("/mobile/activity/icon_qb_yqhy@2x.png"),
      // $h5_activity_qb_scan:   resolveStaticPath("/mobile/activity/icon_scan_small@2x.png"),
      // $h5_activity_qb_tishi:   resolveStaticPath("/mobile/activity/icon_qb_tishi@2x.png"),
      // $h5_activity_qb_home_normal:   resolveStaticPath("/mobile/activity/icon_qb_home_normal@2x.png"),
      // $h5_activity_qb_my_normal:   resolveStaticPath("/mobile/activity/icon_qb_wode_normal@2x.png"),
      // $h5_activity_qb_home_click:   resolveStaticPath("/mobile/activity/icon_qb_home_click@2x.png"),
      // $h5_activity_qb_my_click:   resolveStaticPath("/mobile/activity/icon_qb_wode_click@2x.png"),
      // $h5_activity_qb_jianjie:   resolveStaticPath("/mobile/activity/icon_qb_jianjie@2x.png"),
      // $h5_activity_qb_jj_one:   resolveStaticPath("/mobile/activity/icon_zc_qb_jj_one@3x.png"),
      // $h5_activity_qb_jj_two:   resolveStaticPath("/mobile/activity/icon_zc_qb_jj_two@3x.png"),
      // $h5_activity_qb_jj_three:   resolveStaticPath("/mobile/activity/icon_zc_qb_jj_three@3x.png"),
      // $h5_activity_qb_jj_four:   resolveStaticPath("/mobile/activity/icon_zc_qb_jj_four@3x.png"),
      // $h5_activity_qb_jj_five:   resolveStaticPath("/mobile/activity/icon_zc_qb_jj_five@3x.png"),
      // $h5_activity_qb_jj_six:   resolveStaticPath("/mobile/activity/icon_zc_qb_jj_six@3x.png"),
      // $h5_asset_next:   resolveStaticPath("/mobile/asset/icon_next@2x.png"),
      // $h5_asset_shang:   resolveStaticPath("/mobile/asset/img_shang@2x.png"),
      // $h5_asset_xia:   resolveStaticPath("/mobile/asset/img_xia@2x.png"),
      // $h5_asset_search_cancel:   resolveStaticPath("/mobile/asset/icon_search_cancel@2x.png"),
      // $h5_help_download_bg:   resolveStaticPath("/mobile/help/download_img@1x.png"),


      // $h5_tip_success:   resolveStaticPath("/mobile/icon_success@3x.png"),
      // $h5_tip_fail:   resolveStaticPath("/mobile/img_ts_czcc@3x.png"),

      // $h5_hidden:   resolveStaticPath("/mobile/asset/icon_hidden@2x.png"),
      // $h5_show:   resolveStaticPath("/mobile/asset/icon_show@2x.png"),

      // // v1.3图片
      // $header_exchange_select:   resolveStaticPath('/web/tradePro/right_selected.svg'),
      // $home_safe_pro:   resolveStaticPath('/web/homePro/safe.png'),
      // $home_stable_pro:   resolveStaticPath('/web/homePro/stable.png'),
      // $home_platform_pro:   resolveStaticPath('/web/homePro/platform.png'),
      // $home_financial_pro:   resolveStaticPath('/web/homePro/financial.png'),
      // $home_favorties_normal_pro:   resolveStaticPath('/web/homePro/favorties_normal.svg'),
      // $home_favorties_selected_pro:   resolveStaticPath('/web/homePro/favorties_selected.svg'),
      // $home_sidebar_phone:   resolveStaticPath('/web/homePro/phone_sidebar.svg'),
      // $home_sidebar_service:   resolveStaticPath('/web/homePro/service_sidebar.svg'),
      // $home_sidebar_top:   resolveStaticPath('/web/homePro/top_sidebar.svg'),

      // $home_market_select_normal:   resolveStaticPath('/web/homePro/sort_normal.svg'),
      // $home_market_select_top:   resolveStaticPath('/web/homePro/sort_up.svg'),
      // $home_market_select_bottom:   resolveStaticPath('/web/homePro/sort_bottom.svg'),

      // $logo_footer_pro:   resolveStaticPath("/logo/logo_footer_pro.svg"), // 底部
      // $footer_twitter_pro:   resolveStaticPath("/web/footerPro/footer_twitter.svg"),
      // $footer_faceBook_pro:   resolveStaticPath("/web/footerPro/footer_facebook.svg"),
      // $footer_wb_pro:   resolveStaticPath("/web/footerPro/footer_weibo.svg"),
      // $footer_wechat_pro:   resolveStaticPath("/web/footerPro/footer_wechat.svg"),
      // $footer_telegram_pro:   resolveStaticPath("/web/footerPro/footer_telegram.svg"),
      // $trade_pro_all:   resolveStaticPath('/web/tradePro/sellandbuy_title.svg'),
      // $trade_pro_all_select:   resolveStaticPath('/web/tradePro/sellandbuy_title_selected.svg'),
      // $trade_pro_sell:   resolveStaticPath('/web/tradePro/sell_title.svg'),
      // $trade_pro_sell_select:   resolveStaticPath('/web/tradePro/sell_title_selected.svg'),
      // $trade_pro_buy:   resolveStaticPath('/web/tradePro/buy_title.svg'),
      // $trade_pro_buy_select:   resolveStaticPath('/web/tradePro/buy_title_selected.svg'),
      // $trade_pro_search:   resolveStaticPath('/web/tradePro/search_pop.svg'),

      // $common_checkbox_normal:   resolveStaticPath('/web/commonPro/checkbox_normal.svg'),
      // $common_checkbox_select:   resolveStaticPath('/web/commonPro/checkbox_selected.svg'),
      // $common_checkbox:   resolveStaticPath('/web/commonPro/checkbox.svg'),
      // $common_radio_normal:   resolveStaticPath('/web/commonPro/radio_normal.svg'),
      // $common_radio_select:   resolveStaticPath('/web/commonPro/radio_selected.svg'),
      // $common_radio:   resolveStaticPath('/web/commonPro/radio_normal.svg'),
      // $common_radio_get:   resolveStaticPath('/web/commonPro/radio_get.svg'),
      // $common_nothing_white:   resolveStaticPath('/web/commonPro/empty_white.svg'),
      // $common_nothing_black:   resolveStaticPath('/web/commonPro/empty_black.svg'),
      // $common_download:   resolveStaticPath('/web/commonPro/img_download_app.svg'),

      // $user_recommend_cn:   resolveStaticPath('/web/userPro/label_ch.svg'),
      // $user_recommend_en:   resolveStaticPath('/web/userPro/label_en.svg'),
      // $user_id01:   resolveStaticPath("/web/userPro/ID_01.jpg"),
      // $user_id02:   resolveStaticPath("/web/userPro/ID_02.jpg"),
      // $user_id03:   resolveStaticPath("/web/userPro/ID_03.jpg"),
      // $user_passport01:   resolveStaticPath("/web/userPro/pass1.jpg"),
      // $user_passport02:   resolveStaticPath("/web/userPro/pass2.jpg"),
      // $user_passport03:   resolveStaticPath("/web/userPro/pass3.jpg"),
      // $user_driver01:   resolveStaticPath("/web/userPro/driver1.jpg"),
      // $user_driver02:   resolveStaticPath("/web/userPro/driver2.jpg"),
      // $user_driver03:   resolveStaticPath("/web/userPro/driver3.jpg"),
      // $user_err:   resolveStaticPath("/web/userPro/user_err.svg"),
      // $user_no:   resolveStaticPath("/web/userPro/user_no.svg"),
      // $user_progress:   resolveStaticPath("/web/userPro/user_progress.svg"),
      // $user_succ:   resolveStaticPath("/web/userPro/user_succ.svg"),
      // $user_add:   resolveStaticPath("/web/userPro/user_add.svg"),

      // // $header_news:   resolveStaticPath/web/headerPro/menu_message_normal_white.svg"),
      // // $header_news_active:   resolveStaticPath/web/headerPro/menu_message_hover.svg"),
      // $h5_icon_cancel:   resolveStaticPath('/mobile/asset/icon_cancel@3x.png'),

      // // 套利宝
      // $tlb_step1:   resolveStaticPath("/taolibao/tlb_step_one_white.svg"),
      // $tlb_step2:   resolveStaticPath("/taolibao/tlb_step_two_white.svg"),
      // $tlb_step3:   resolveStaticPath("/taolibao/tlb_step_three_white.svg"),
      // $tlb_step4:   resolveStaticPath("/taolibao/tlb_step_four_white.svg"),
      // $tlb_title:   resolveStaticPath('/taolibao/tlb_detail.svg'),
      // $tlb_circle:   resolveStaticPath('/taolibao/tlb_title.svg'),
      // $tlb_wechat:   resolveStaticPath("/taolibao/tlb_wechat.png"),

      // // h5修改登录注册 9.21
      // $h5_login_logo:   resolveStaticPath("/logo/logo_login_h5.png"),
      // $h5_pwd_show:   resolveStaticPath("/mobile/login/login_pwd_show@2x.png"),
      // $h5_pwd_hide:   resolveStaticPath("/mobile/login/login_pwd_hide@2x.png"),
      // $h5_login_back:   resolveStaticPath("/mobile/login/login_cancel@2x.png"),

      // // h5注册活动
      // $act_reg_servive:   resolveStaticPath("/mobile/activity/reg_code@3x.png"),
      // $act_reg_telegram:   resolveStaticPath("/mobile/activity/reg_telegram@3x.png"),
      // $h5_act_reg_gift:   resolveStaticPath("/mobile/activity/reg_gift@3x.png"),
      // $h5_act_reg_back:   resolveStaticPath("/mobile/activity/reg_back@3x.png"),
      // $h5_user_invite:   resolveStaticPath("/mobile/user/invite/icon@3x.png"),

      // // h5注册活动
      // $h5_activty_double_title_cn:   resolveStaticPath("/mobile/activity/word_ch@0.5x.png"),
      // $h5_activty_double_title_en:   resolveStaticPath("/mobile/activity/dou_word_en@0.5x.png"),

      // $activty_double_title_cn:   resolveStaticPath("/web/activityGiving/banner_word_ch.svg"),
      // $activty_double_title_en:   resolveStaticPath("/web/activityGiving/banner_wordEn.svg"),

      // $poster_bg: "",
      // $poster_logo: "",

      // //otc
      // $otc_pay_alipay_s:   resolveStaticPath('/otc/otc_alipay_small@3x.png'),
      // $otc_pay_alipay_b:   resolveStaticPath('/otc/otc_alipay_big@3x.png'),
      // $otc_pay_wechat_s:   resolveStaticPath('/otc/otc_wechat_small@3x.png'),
      // $otc_pay_wechat_b:   resolveStaticPath('/otc/otc_wechat_big@3x.png'),
      // $otc_pay_bank_s:   resolveStaticPath('/otc/otc_bank_small@3x.png'),
      // $otc_pay_bank_b:   resolveStaticPath('/otc/otc_bank_big@3x.png'),
      // $otc_exchange_w:   resolveStaticPath('/otc/otc_exchange_big@3x.png'),
      // $otc_exchange_b:   resolveStaticPath('/otc/otc_exchange_small@3x.png'),

      // $otc_user_bank:   resolveStaticPath('/web/userPro/user_otc_bank_small.svg'),
      // $otc_user_alipay:   resolveStaticPath('/web/userPro/user_otc_alipay.svg'),
      // $otc_user_wechat:   resolveStaticPath('/web/userPro/user_otc_wechat.svg'),
    }
  }

  componentWillMount() {
    super.componentWillMount();
    // console.log('exchangeViewBase componentWillMount')
  }

  componentDidMount() {
    super.componentDidMount();
    // console.log(this)
    // this.location = window.location.href;
    // document.getElementById('app').scrollIntoView(true)
  }

  componentWillUpdate() {
    super.componentWillUpdate();
    // console.log("WillUpdate", this, this.location);
    // if (this.location !== window.location.href){
    //   document.getElementById("app").scrollIntoView(true);
    //   this.location = window.location.href;
    // }
    // console.log('exchangeViewBase componenDidMount')
  }
}
