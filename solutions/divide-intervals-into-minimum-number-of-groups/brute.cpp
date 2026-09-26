class Solution {
public:
    int minGroups(vector<vector<int>>& intervals) {
        int best = 0;
        for (auto& a : intervals) {
            int c = 0;
            for (auto& b : intervals) if (b[0] <= a[0] && a[0] <= b[1]) c++;   // intervals containing a's start
            best = max(best, c);
        }
        return best;
    }
};
