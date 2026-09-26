class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> all = intervals, out;
        all.push_back(newInterval);
        sort(all.begin(), all.end());
        for (auto& c : all) {
            if (!out.empty() && c[0] <= out.back()[1]) out.back()[1] = max(out.back()[1], c[1]);
            else out.push_back(c);
        }
        return out;
    }
};
