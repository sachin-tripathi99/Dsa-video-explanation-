class Solution {
    int best = INT_MAX;
    void go(vector<int>& a, int start, int parts, int worst) {   // try every end for the current part
        if (start == (int)a.size()) { if (parts == 0) best = min(best, worst); return; }
        if (parts == 0) return;
        int s = 0;
        for (int end = start; end < (int)a.size(); end++) {
            s += a[end];
            go(a, end + 1, parts - 1, max(worst, s));
        }
    }
public:
    int splitArray(vector<int>& nums, int k) {
        go(nums, 0, k, 0);
        return best;
    }
};
