class Solution {
public:
    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
        priority_queue<pair<int, int>> heap;                // (distance², index): farthest on top
        for (int i = 0; i < (int)points.size(); i++) {
            heap.push({points[i][0] * points[i][0] + points[i][1] * points[i][1], i});
            if ((int)heap.size() > k) heap.pop();
        }
        vector<vector<int>> out;
        while (!heap.empty()) { out.push_back(points[heap.top().second]); heap.pop(); }
        return out;
    }
};
