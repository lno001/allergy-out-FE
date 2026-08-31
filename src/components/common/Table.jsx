import Pagination from './Pagination';
import {
  TableWrapper,
  StyledTable,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableEmptyState,
  TablePaginationWrapper,
} from '../../styles/common.styled';

/**
 * 관리자 회원목록/레시피목록처럼 표 형태 데이터를 보여줄 때 쓰는 공용 테이블.
 * RecipeCard와 달리 "데이터 모양"을 모릅니다 — columns의 render로 뭐든 그릴 수 있어요.
 *
 * props
 * - columns   : [{ key, label, render?(row) }]
 *     · key    — 컬럼 식별자. render가 없으면 row[key] 값을 그대로 텍스트로 표시
 *     · label  — 헤더에 표시할 이름
 *     · render — (row) => JSX. 주면 셀을 마음대로 그림 (Badge, Button 등)
 * - data      : 행 데이터 배열 (undefined여도 안 깨짐 — 내부에서 빈 배열 처리)
 * - rowKey    : 각 행을 구분할 고유 필드명 (기본 'id')
 * - emptyText : data가 빈 배열일 때 보여줄 문구
 * - pagination: { currentPage, totalPages, onPageChange } — 생략하면 페이지네이션 숨김
 *
 * 사용 규칙: 수정/삭제 같은 액션 컬럼은 반드시 기존 Button 컴포넌트를 재사용하세요.
 * (수정 = variant="secondary", 삭제 = variant="dangerOutline" — 감사에서 지적된
 * "관리자 테이블만 색 구분이 없던 문제"를 반복하지 않기 위함)
 *
 * @example
 * const columns = [
 *   { key: 'name', label: '이름' },
 *   { key: 'email', label: '이메일' },
 *   {
 *     key: 'role',
 *     label: '역할',
 *     render: (row) => (
 *       <Badge variant={row.role === '운영자' ? 'info' : 'neutral'}>{row.role}</Badge>
 *     ),
 *   },
 *   {
 *     key: 'actions',
 *     label: '관리',
 *     render: (row) => (
 *       <>
 *         <Button size="sm" variant="secondary" onClick={() => edit(row)}>수정</Button>
 *         <Button size="sm" variant="dangerOutline" onClick={() => remove(row)}>삭제</Button>
 *       </>
 *     ),
 *   },
 * ];
 *
 * <Table
 *   columns={columns}
 *   data={members}
 *   rowKey="memberNo"
 *   emptyText="회원이 없습니다."
 *   pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
 * />
 */
function Table({ columns, data, rowKey = 'id', emptyText = '표시할 데이터가 없어요.', pagination }) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <TableHeaderRow>
            {columns.map((col) => (
              <TableHeaderCell key={col.key}>{col.label}</TableHeaderCell>
            ))}
          </TableHeaderRow>
        </thead>
        <tbody>
          {safeData.map((row) => (
            <TableRow key={row[rowKey]}>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>

      {safeData.length === 0 && <TableEmptyState>{emptyText}</TableEmptyState>}

      {pagination && (
        <TablePaginationWrapper>
          <Pagination {...pagination} />
        </TablePaginationWrapper>
      )}
    </TableWrapper>
  );
}

export default Table;
