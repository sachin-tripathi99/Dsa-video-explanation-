class Solution {
    void collect(TreeNode* n, vector<int>& out) {
        if (!n) return;
        out.push_back(n->val);
        collect(n->left, out);
        collect(n->right, out);
    }
public:
    int getMinimumDifference(TreeNode* root) {
        vector<int> vals;
        collect(root, vals);
        int best = INT_MAX;
        for (size_t i = 0; i < vals.size(); i++)
            for (size_t j = i + 1; j < vals.size(); j++) best = min(best, abs(vals[i] - vals[j]));
        return best;
    }
};
