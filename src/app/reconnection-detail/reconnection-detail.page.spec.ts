import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReconnectionDetailPage } from './reconnection-detail.page';

describe('ReconnectionDetailPage', () => {
  let component: ReconnectionDetailPage;
  let fixture: ComponentFixture<ReconnectionDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconnectionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
