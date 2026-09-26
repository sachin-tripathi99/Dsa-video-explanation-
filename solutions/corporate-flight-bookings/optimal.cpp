class Solution {
public:
    vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {
        vector<int> d(n + 1, 0);
        for (auto& b : bookings) { d[b[0] - 1] += b[2]; d[b[1]] -= b[2]; }
        vector<int> ans(n);
        int run = 0;
        for (int i = 0; i < n; i++) { run += d[i]; ans[i] = run; }
        return ans;
    }
};
