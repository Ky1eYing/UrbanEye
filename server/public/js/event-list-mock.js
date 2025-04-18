document.addEventListener('DOMContentLoaded', function() {
    // 模拟事件数据
    const mockEvents = [
        {
            _id: '1',
            title: 'Traffic Jam on Main Street',
            location: 'Main Street, Downtown',
            time: '10:30 AM',
            day: 'Mon',
            timeAgo: '5 min',
            distance: '0.5 mi',
            imageUrl: 'https://images.unsplash.com/photo-1503179008861-d1e2b41f8bec?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
            _id: '2',
            title: 'Food Truck Festival',
            location: 'Central Park',
            time: '11:00 AM',
            day: 'Mon',
            timeAgo: '15 min',
            distance: '1.2 mi',
            imageUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Rm9vZCUyMFRydWNrfGVufDB8fDB8fHww'
        },
        {
            _id: '3',
            title: 'Road Construction',
            location: '5th Avenue',
            time: '9:45 AM',
            day: 'Mon',
            timeAgo: '30 min',
            distance: '2.5 mi',
            imageUrl: 'https://images.unsplash.com/photo-1593436878048-92622a77d315?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Um9hZCUyMENvbnN0cnVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
            _id: '4',
            title: 'Street Performance',
            location: 'Times Square',
            time: '10:15 AM',
            day: 'Mon',
            timeAgo: '45 min',
            distance: '3.1 mi',
            imageUrl: 'https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fFN0cmVldCUyMFBlcmZvcm1hbmNlfGVufDB8fDB8fHww'
        },
        {
            _id: '5',
            title: 'Accident on Highway',
            location: 'I-95 North',
            time: '8:30 AM',
            day: 'Mon',
            timeAgo: '1 hr',
            distance: '4.2 mi',
            imageUrl: 'https://images.unsplash.com/photo-1627398924667-7f4ab354ab49?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QWNjaWRlbnQlMjBvbiUyMEhpZ2h3YXl8ZW58MHx8MHx8fDA%3D'
        },
        {
            _id: '6',
            title: 'Parade Route',
            location: 'Broadway',
            time: '9:00 AM',
            day: 'Mon',
            timeAgo: '1.5 hr',
            distance: '5.0 mi',
            imageUrl: 'https://images.unsplash.com/photo-1677211310859-5a263e96f99c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhhbmtzZ2l2aW5nJTIwUGFyYWRlfGVufDB8fDB8fHww'
        },
        {
            _id: '7',
            title: 'Street Market',
            location: 'Market Street',
            time: '7:45 AM',
            day: 'Mon',
            timeAgo: '2 hr',
            distance: '6.3 mi',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1683121624323-0c5bf3ca6af2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U3RyZWV0JTIwTWFya2V0fGVufDB8fDB8fHww'
        },
        {
            _id: '8',
            title: 'Road Closed for Repairs',
            location: 'Oak Street',
            time: '6:30 AM',
            day: 'Mon',
            timeAgo: '3 hr',
            distance: '7.8 mi',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1664360971109-81c34241ddfe?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Um9hZCUyMENsb3NlZCUyMGZvciUyMFJlcGFpcnN8ZW58MHx8MHx8fDA%3D'
        },
        {
            _id: '9',
            title: 'Community Event',
            location: 'City Hall',
            time: '5:15 AM',
            day: 'Mon',
            timeAgo: '4 hr',
            distance: '9.1 mi',
            imageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fENvbW11bml0eSUyMEV2ZW50fGVufDB8fDB8fHww'
        },
        {
            _id: '10',
            title: 'Traffic Light Outage',
            location: 'Main & 1st',
            time: '4:00 AM',
            day: 'Mon',
            timeAgo: '5 hr',
            distance: '10.5 mi',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1682834983265-27a10ba5232c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VHJhZmZpYyUyMExpZ2h0fGVufDB8fDB8fHww'
        }
    ];

    // 获取事件列表容器
    const eventList = document.querySelector('.event-list');
    
    if (eventList) {
        // 清空现有内容
        eventList.innerHTML = '';
        
        // 添加模拟事件
        mockEvents.forEach(event => {
            const eventItemHTML = `
                <div class="event-item" data-event-id="${event._id}">
                    <div class="event-image">
                        <img src="${event.imageUrl}" alt="${event.title}">
                    </div>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <div class="event-meta">
                            <span class="event-location">${event.location}</span>
                            <div class="event-distance-time-ago">
                                <span class="event-distance">${event.distance}</span>
                                <span>&nbsp;·&nbsp;</span>
                                <span class="event-time-ago">${event.timeAgo} ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            eventList.insertAdjacentHTML('beforeend', eventItemHTML);
        });
    }
}); 