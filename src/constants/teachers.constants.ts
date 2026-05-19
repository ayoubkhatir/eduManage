import type { UICardType } from "#/components/admin/cards/UICard";


export const UICardList: Array<UICardType> = [
    {
        id: '0',
        iconName: 'school',
        iconColor: 'blue',
        stateIcon: 'trending_up',
        percentage: 5,
        cardTitle: 'Total Teachers',
        info: '42',
    },
    {
        id: '1',
        iconName: 'bolt',
        iconColor: 'green',
        stateIcon: 'trending_up',
        percentage: 2,
        cardTitle: 'Active Now',
        info: '38',
    },
    {
        id: '2',
        iconName: 'person_add',
        iconColor: 'purple',
        stateIcon: 'trending_up',
        percentage: 10,
        cardTitle: 'New This Month',
        info: '3',
    },
]