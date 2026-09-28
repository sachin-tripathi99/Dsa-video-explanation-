class Solution {
    vector<int> view;
    void dfs(TreeNode* n, int depth) {
        if (!n) return;
        if (depth == (int)view.size()) view.push_back(n->val);   // first node at this depth
        dfs(n->right, depth + 1);                           // right first
        dfs(n->left, depth + 1);
    }
public:
    vector<int> rightSideView(TreeNode* root) {
        dfs(root, 0);
        return view;
    }
};
