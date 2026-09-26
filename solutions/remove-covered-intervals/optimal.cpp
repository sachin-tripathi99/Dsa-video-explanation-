class Solution {
public:
    int removeCoveredIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) { return a[0] != b[0] ? a[0] < b[0] : a[1] > b[1]; });
        int kept = 0, maxEnd = INT_MIN;
        for (auto& iv : intervals) {
            if (iv[1] > maxEnd) {                       // sticks out → not covered
                kept++;
                maxEnd = iv[1];
            }
        }
        return kept;
    }
};
