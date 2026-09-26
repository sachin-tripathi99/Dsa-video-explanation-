class Solution {
public:
    bool carPooling(vector<vector<int>>& trips, int capacity) {
        vector<int> d(1001, 0);
        for (auto& t : trips) { d[t[1]] += t[0]; d[t[2]] -= t[0]; }   // board at from, leave at to
        int riders = 0;
        for (int x : d) {
            riders += x;
            if (riders > capacity) return false;
        }
        return true;
    }
};
