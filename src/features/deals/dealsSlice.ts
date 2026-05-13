import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Deal, FilterOptions, SortOptions, PaginationOptions, PaginatedResult } from '../../types';
import { dealService } from '../../services/dealService';

interface DealsState {
  items: Deal[];
  total: number;
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  sort?: SortOptions;
  pagination: PaginationOptions;
}

const initialState: DealsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  filters: {},
  sort: undefined,
  pagination: { page: 1, limit: 10 }
};

export const fetchDeals = createAsyncThunk<PaginatedResult<Deal>, void, { state: any }>(
  'deals/fetchDeals',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { deals } = getState();
      const response = await dealService.getDeals(deals.filters, deals.sort, deals.pagination);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<FilterOptions>) {
      state.filters = action.payload;
      state.pagination.page = 1; // Reset to first page on filter change
    },
    setSort(state, action: PayloadAction<SortOptions | undefined>) {
      state.sort = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.pagination.page = action.payload.page;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch deals';
      });
  }
});

export const { setFilters, setSort, setPage } = dealsSlice.actions;
export default dealsSlice.reducer;
