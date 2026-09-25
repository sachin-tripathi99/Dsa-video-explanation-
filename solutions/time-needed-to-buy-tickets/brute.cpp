class Solution {
public:
    int timeRequiredToBuy(vector<int>& tickets, int k) {
        queue<pair<int, int>> q;
        for (int i = 0; i < (int)tickets.size(); i++) q.push({i, tickets[i]});
        int time = 0;
        while (true) {
            auto [i, left] = q.front(); q.pop();
            time++;
            left--;                                      // buy one ticket
            if (i == k && left == 0) return time;
            if (left > 0) q.push({i, left});             // back of the line
        }
    }
};
