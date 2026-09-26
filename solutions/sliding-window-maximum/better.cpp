class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        priority_queue<pair<int, int>> pq;                  // (value, index), max first
        vector<int> out;
        for (int i = 0; i < (int)nums.size(); i++) {
            pq.push({nums[i], i});
            if (i >= k - 1) {
                while (pq.top().second <= i - k) pq.pop();  // lazily drop expired tops
                out.push_back(pq.top().first);
            }
        }
        return out;
    }
};
