class Solution {
    priority_queue<int> lo;                                  // smaller half
    priority_queue<int, vector<int>, greater<int>> hi;       // bigger half
    unordered_map<int, int> delayed;                         // lazy deletions
    int loSize = 0, hiSize = 0;                              // live counts

    template <typename H> void prune(H& h) {
        while (!h.empty() && delayed[h.top()] > 0) { delayed[h.top()]--; h.pop(); }
    }
    void balance() {
        if (loSize > hiSize + 1) { hi.push(lo.top()); lo.pop(); loSize--; hiSize++; prune(lo); }
        else if (loSize < hiSize) { lo.push(hi.top()); hi.pop(); hiSize--; loSize++; prune(hi); }
    }
    void insert(int x) {
        if (lo.empty() || x <= lo.top()) { lo.push(x); loSize++; }
        else { hi.push(x); hiSize++; }
        balance();
    }
    void erase(int x) {
        delayed[x]++;
        if (x <= lo.top()) { loSize--; if (x == lo.top()) prune(lo); }
        else { hiSize--; if (x == hi.top()) prune(hi); }
        balance();
    }
    double median(int k) { return k % 2 ? lo.top() : ((double)lo.top() + hi.top()) / 2; }
public:
    vector<double> medianSlidingWindow(vector<int>& nums, int k) {
        for (int i = 0; i < k; i++) insert(nums[i]);
        vector<double> out{median(k)};
        for (int i = k; i < (int)nums.size(); i++) {
            insert(nums[i]);
            erase(nums[i - k]);
            out.push_back(median(k));
        }
        return out;
    }
};
