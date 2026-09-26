class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        int n = intervals.size(), best = 0;
        vector<int> keep(n, 1);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++)
                if (intervals[j][1] <= intervals[i][0]) keep[i] = max(keep[i], keep[j] + 1);
            best = max(best, keep[i]);
        }
        return n - best;
    }
};
