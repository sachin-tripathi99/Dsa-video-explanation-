class Solution {
    static int d(const vector<int>& p) { return p[0] * p[0] + p[1] * p[1]; }
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        int lo = 0, hi = points.size() - 1;
        mt19937 rng(7);
        while (lo < hi) {
            int p = lo + rng() % (hi - lo + 1);
            swap(points[p], points[hi]);                     // random pivot to the end
            int piv = d(points[hi]), s = lo;
            for (int i = lo; i < hi; i++) if (d(points[i]) < piv) swap(points[i], points[s++]);
            swap(points[s], points[hi]);                     // pivot at its sorted position s
            if (s == k) break;
            if (s < k) lo = s + 1; else hi = s - 1;
        }
        return vector<vector<int>>(points.begin(), points.begin() + k);
    }
};
