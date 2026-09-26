class Solution {
    int needed(vector<int>& w, int cap) {           // greedy: new day when the next box does not fit
        int d = 1, load = 0;
        for (int x : w) {
            if (load + x > cap) { d++; load = 0; }
            load += x;
        }
        return d;
    }
public:
    int shipWithinDays(vector<int>& weights, int days) {
        int lo = *max_element(weights.begin(), weights.end());
        int hi = accumulate(weights.begin(), weights.end(), 0);   // [heaviest, total]
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (needed(weights, mid) <= days) hi = mid;
            else lo = mid + 1;
        }
        return lo;
    }
};
