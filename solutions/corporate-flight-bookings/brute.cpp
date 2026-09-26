class Solution {
public:
    vector<int> corpFlightBookings(vector<vector<int>>& bookings, int n) {
        vector<int> ans(n, 0);
        for (auto& b : bookings)
            for (int f = b[0]; f <= b[1]; f++) ans[f - 1] += b[2];
        return ans;
    }
};
