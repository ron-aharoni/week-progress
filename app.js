function progressApp() {
    return {
        progress: 0,
        currentTimeFormatted: '',
        
        init() {
            this.updateProgress();
            // Update progress every second
            setInterval(() => this.updateProgress(), 1000);
        },
        
        updateProgress() {
            const now = new Date();
            this.updateFormattedTime(now);
            
            // Calculate progress
            this.progress = this.calculateWorkWeekProgress(now);
        },
        
        updateFormattedTime(now) {
            const options = { 
                weekday: 'long',
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            this.currentTimeFormatted = now.toLocaleString('en-US', options);
        },
        
        calculateWorkWeekProgress(now) {
            const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const hour = now.getHours();
            const minute = now.getMinutes();
            const second = now.getSeconds();
            
            // Work week: Monday-Friday, 9am-6pm (9 hours per day)
            // Total work week hours: 5 days * 9 hours = 45 hours
            
            // Check if current time is outside work week
            if (day === 0 || day === 6) {
                // Weekend
                return 0;
            }
            
            // Calculate completed full days
            const completedDays = day - 1; // Days before today
            const completedHoursFromPreviousDays = completedDays * 9;
            
            if (hour < 9) {
                // Before work hours, but count previous days
                return (completedHoursFromPreviousDays / 45) * 100;
            }
            
            if (hour >= 18) {
                // After work hours
                if (day === 5) {
                    // Friday after 6pm - work week complete
                    return 100;
                } else {
                    // Work day complete but work week not yet
                    return ((completedDays + 1) * 9) / 45 * 100;
                }
            }
            
            // During work hours
            // Calculate completed hours in current day
            const currentDayHours = (hour - 9) + (minute / 60) + (second / 3600);
            
            // Calculate completed hours in work week so far
            const completedHours = completedHoursFromPreviousDays + currentDayHours;
            
            // Calculate progress percentage
            return (completedHours / 45) * 100;
        }
    };
} 
