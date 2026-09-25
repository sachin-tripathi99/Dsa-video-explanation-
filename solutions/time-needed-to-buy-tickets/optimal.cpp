class Solution {
public:
    int timeRequiredToBuy(vector<int>& tickets, int k) {
        int time = 0;
        for (int i = 0; i < (int)tickets.size(); i++) {
            if (i <= k) time += min(tickets[i], tickets[k]);
            else time += min(tickets[i], tickets[k] - 1);   // k finishes first in the last round
        }
        return time;
    }
};
