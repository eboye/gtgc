export function colorByActivityType(activityType: string): string {
  switch (activityType) {
    case 'Flying': return "#a15856";
    case 'Car': return "#f25f5c";
    case 'Boating':return "#f9a061";
    case 'Cycling': return "#ffe066";
    case 'Public Transport': return "#92ae83";
    case 'Walking': return "#247ba0";
    case 'Unknown':
    default: return "#50514f";
  }
}
