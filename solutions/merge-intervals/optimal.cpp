class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> out;
        for (auto& c : intervals) {
            if (!out.empty() && c[0] <= out.back()[1]) out.back()[1] = max(out.back()[1], c[1]);   // extend
            else out.push_back(c);                                                                // new group
        }
        return out;
    }
};
