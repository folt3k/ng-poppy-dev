import { animate, state, style, transition, trigger } from '@angular/animations';
export const fadeInAnimation = trigger('fadeIn', [
    state('open', style({
        transform: 'translateY(0px)',
        opacity: 1,
    })),
    state('close', style({
        transform: 'translateY(-6px)',
        opacity: 0.5,
    })),
    transition('close => open', [animate('0.15s')]),
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5hbmltYXRpb25zLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2ZvbHRpL1Byb2plY3RzL25nLXBvcHB5L3Byb2plY3RzL25nLXBvcHB5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9wb3BvdmVyL3BvcG92ZXIuYW5pbWF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRWpGLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFO0lBQy9DLEtBQUssQ0FDSCxNQUFNLEVBQ04sS0FBSyxDQUFDO1FBQ0osU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixPQUFPLEVBQUUsQ0FBQztLQUNYLENBQUMsQ0FDSDtJQUNELEtBQUssQ0FDSCxPQUFPLEVBQ1AsS0FBSyxDQUFDO1FBQ0osU0FBUyxFQUFFLGtCQUFrQjtRQUM3QixPQUFPLEVBQUUsR0FBRztLQUNiLENBQUMsQ0FDSDtJQUNELFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztDQUNoRCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuZXhwb3J0IGNvbnN0IGZhZGVJbkFuaW1hdGlvbiA9IHRyaWdnZXIoJ2ZhZGVJbicsIFtcbiAgc3RhdGUoXG4gICAgJ29wZW4nLFxuICAgIHN0eWxlKHtcbiAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMHB4KScsXG4gICAgICBvcGFjaXR5OiAxLFxuICAgIH0pXG4gICksXG4gIHN0YXRlKFxuICAgICdjbG9zZScsXG4gICAgc3R5bGUoe1xuICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNnB4KScsXG4gICAgICBvcGFjaXR5OiAwLjUsXG4gICAgfSlcbiAgKSxcbiAgdHJhbnNpdGlvbignY2xvc2UgPT4gb3BlbicsIFthbmltYXRlKCcwLjE1cycpXSksXG5dKTtcbiJdfQ==