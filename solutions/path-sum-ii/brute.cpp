class Solution {
    vector<vector<int>> all;
    vector<int> path;
    void collect(TreeNode* n) {
        if (!n) return;
        path.push_back(n->val);
        if (!n->left && !n->right) all.push_back(path);     // every leaf path
        collect(n->left);
        collect(n->right);
        path.pop_back();
    }
public:
    vector<vector<int>> pathSum(TreeNode* root, int targetSum) {
        collect(root);
        vector<vector<int>> out;
        for (auto& p : all) if (accumulate(p.begin(), p.end(), 0) == targetSum) out.push_back(p);
        return out;
    }
};
