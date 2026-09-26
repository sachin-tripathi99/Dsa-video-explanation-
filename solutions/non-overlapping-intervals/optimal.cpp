class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) { return a[1] < b[1]; });   // by end
        int removed = 0;
        long long end = LLONG_MIN;
        for (auto& iv : intervals) {
            if (iv[0] >= end) end = iv[1];              // keep
            else removed++;                             // overlaps the kept set
        }
        return removed;
    }
};
