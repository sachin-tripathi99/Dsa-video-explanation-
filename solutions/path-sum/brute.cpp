class Solution {
    vector<vector<int>> paths;
    vector<int> path;
    void collect(TreeNode* node) {
        if (!node) return;
        path.push_back(node->val);
        if (!node->left && !node->right) paths.push_back(path);   // copy at each leaf
        collect(node->left);
        collect(node->right);
        path.pop_back();
    }
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        collect(root);
        for (auto& p : paths) if (accumulate(p.begin(), p.end(), 0) == targetSum) return true;
        return false;
    }
};
