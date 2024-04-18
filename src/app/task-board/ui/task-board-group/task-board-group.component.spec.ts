import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskBoardGroupComponent } from './task-board-group.component';

describe('TaskBoardGroupComponent', () => {
  let component: TaskBoardGroupComponent;
  let fixture: ComponentFixture<TaskBoardGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskBoardGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskBoardGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
