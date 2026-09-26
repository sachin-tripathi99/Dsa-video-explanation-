class Solution {
public:
    int findMinArrowShots(vector<vector<int>>& points) {
        sort(points.begin(), points.end(), [](auto& a, auto& b) { return a[1] < b[1]; });   // by end
        int arrows = 0;
        long long x = LLONG_MIN;
        for (auto& p : points) {
            if (p[0] > x) {                             // still intact → new arrow at its end
                arrows++;
                x = p[1];
            }
        }
        return arrows;
    }
};
