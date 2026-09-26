class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> out;
        int s = newInterval[0], e = newInterval[1];
        size_t i = 0, n = intervals.size();
        while (i < n && intervals[i][1] < s) out.push_back(intervals[i++]);   // before
        while (i < n && intervals[i][0] <= e) {                              // overlap
            s = min(s, intervals[i][0]);
            e = max(e, intervals[i][1]);
            i++;
        }
        out.push_back({s, e});
        while (i < n) out.push_back(intervals[i++]);                         // after
        return out;
    }
};
