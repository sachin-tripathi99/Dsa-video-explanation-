class Solution {
    int needed(vector<int>& w, int cap) {
        int d = 1, load = 0;
        for (int x : w) {
            if (load + x > cap) { d++; load = 0; }
            load += x;
        }
        return d;
    }
public:
    int shipWithinDays(vector<int>& weights, int days) {
        int cap = *max_element(weights.begin(), weights.end());
        while (needed(weights, cap) > days) cap++;
        return cap;
    }
};
