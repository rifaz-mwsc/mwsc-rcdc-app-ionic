import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisconnectionDetailPage } from './disconnection-detail.page';

describe('DisconnectionDetailPage', () => {
  let component: DisconnectionDetailPage;
  let fixture: ComponentFixture<DisconnectionDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DisconnectionDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
