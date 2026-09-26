class Solution {
public:
    vector<vector<int>> intervalIntersection(vector<vector<int>>& firstList, vector<vector<int>>& secondList) {
        vector<vector<int>> out;
        for (auto& a : firstList)
            for (auto& b : secondList) {
                int lo = max(a[0], b[0]), hi = min(a[1], b[1]);
                if (lo <= hi) out.push_back({lo, hi});
            }
        return out;
    }
};
